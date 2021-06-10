import React from 'react';
import ReactDOM from 'react-dom';
import loadable from '@loadable/component';

import { addCartReducer } from '@nike/ux-tread-cart-redux';
import { addWishlistReducer, WISHLIST_STATE_KEY } from '@nike/wishlist-redux';
import { addPartnerCartReducer } from '@nike/partnercart-redux';
import { CART_STATE_KEY, CLOUD_CART_BUCKET } from '@nike/cart-constants';

import { NIKE_SHOP_ROOT_ID } from '@nike/shop-public-constants';
// import crcCodes from '@nike/ux-tread-crc-code/lib/buy/carts/v2/crcCodes'; // TODO MYBAG-2369 uncomment if we are supposed to do this on every page (we might have to for stale promos/pdp/or navigate away without clearing?)

import { addPageAction } from '@nike/ux-tread-new-relic';
import { SHOP_STATE_KEY, USER_INITIALIZED } from './constants';
import shopReducer from './reducer';

import createPersistentStore from './create-persistent-store.js';
import NikeShop from './nike-shop.js';
import initUserAndObserveStore from './init-user-and-observe-store';
import onCartUpdateSideEffects from './on-cart-update-side-effects';
import setupLocaleData from './setup-locale-data';
import getIsPageCart from './get-is-page-cart';

/**
 * @name window.initNikeShop
 * @memberof shop-components
 * @param {object} params - named parameters
 * @param {object} params.store - optional redux store for backwards compatibility only during cutover period
 * @param {string} params.country - iso 2 letter country code, eg. cn
 * @param {string} params.language - bcp-47 language-COUNTRYCODE, eg. es-US
 * @param {Array.<string>} [params.errorsToExclude=['D3D734B6']] - an array of unique error crc codes to exclude, ex. codes via ux-tread-crc-code/lib/buy/carts/v2/crcCodes
 * @param {Array.<string>} [params.warningsToIncludeInDialog=[]] - an array of unique warning crc codes to include as errors
 * @param {boolean} [params.useListeners = true] - **EXPERIMENTAL** flag to turn of custom event dispatches, temporarily exposed and might be internalized later
 * @param {Function} params.onCartUpdate - callback function that has updated cart as parameter to allow consumers to hook into cart updates
 * @returns {NikeShop} - singleton of NikeShop which is also exposed globally already as window.NikeShop
 *
 * @example
 * <caption>
 * #### Basic instantiation of nike-shop-client within first client file of an app.
 * - Locale values can be derived via usage of ux-tread-localization, language-tunnel-json, fetched using url params from `https://www.nike.com/assets/experience/pet/locale-data/{countryInUrl}__{languageInUrl}.json`, or preferably via web-shell's locale module @see {@link https://github.nike.com/web/web-shell/blob/master/packages/web-shell-client/user-guide/locale.md}
 *    - country should be 2 letter countryCode (getCountry from ux-tread-localization)
 *      - Examples: us, US, cn, fr. See country and hreflang values within https://www.nike.com/assets/experience/pet/locale-data/us.json)
 *    - language should be bcp-47 valid language (getHrefLang from ux-tread-localization)
 *      - Examples: en-US, es-US, zh-Hans. See country and hreflang values within https://www.nike.com/assets/experience/pet/locale-data/us__es.json)
 * - Note that store is ONLY required if you are going to ship to prod while still using ux-tread-cart-redux for fetchCart and addToCart, wishlist-redux for addToWishlist, or are using the checkout-button we ship
 * </caption>
 * // client.prod.js
 * window.initNikeShop({
 *   country: 'us',
 *   language: 'en-US',
 *   store: yourReduxStoreThatHasOurReduxReducersInstalled, // temporary during cutover period
 * });
 *
 * @example
 * <caption>
 * #### Setting up html response and script tag
 * Our entry point installation is a script tag and an empty div added to the html response vs installation of node modules.
 * The div will be used for the NikeShop MFE to render and/or portal through.
 * In the future this might change to an edge-side includes tag but for now we'll simplify to this portion which you will not have to touch much in the long run.
 * - Place div using id from shop-public-constants module below the react app root div
 *   - the shop-public-constants package is purposefully decoupled to avoid requiring version updates and will never break as they will be only constants for public usage
 * - Directly following the react, react-dom and any polyfill scripts, add a script tag with the src value set to https://www.nike.com/assets/experience/shop-components/public/nike-shop-client.js
 *   - Note that there is no version in the script src as we webpack to a tiny entry point file that should never change. It has a shorter cache time and the remainder of the code required will be dynamically loaded, with chunks only changing hashes based on which files were touched for changes.
 *     This lets us deploy changes independently without requiring consumers to bump versions in their code base.
 *
 * </caption>
 * // example of renderer.js portion as we understand our eco-system today
 * import { NIKE_SHOP_ROOT_ID } from "@nike/shop-public-constants";
 *
 * // in a function where you might be returning a string that creates the html response today
 * function htmlStringRenderer(params) {
 * // ...
 *  return `
 *     <div id="react-root">
 *       ${appString}
 *     </div>
 *     <div id="${NIKE_SHOP_ROOT_ID}"></div>
 *
 *     <script src="${VENDOR_SCRIPTS.reactScript}"></script>
 *     <script src="${VENDOR_SCRIPTS.reactDomScript}"></script>
 *     <script src="${VENDOR_SCRIPTS.intersectionObserverPolyfill}"></script>
 *     <script src="https://www.nike.com/assets/experience/shop-components/public/nike-shop-client.js"></script>
 *   `;
 *    // ...
 * }
 *
 */
export default function bootstrapNikeShop({
  store,
  errorsToExclude = ['D3D734B6', 'D12EE4E6', '1E17F469', '9E64809B'],
  warningsToIncludeInDialog = [],
  country,
  language,
  useListeners = true,
  onCartUpdate,
  featureFlags = {},
  ...rest
}) {
  if (!country || country?.toLowerCase() === 'xl') {
    addPageAction('nike-shop-invalid-country', { country, language });
    return {}; // since we return shopInstance, we should return an empty obj vs undefined or null to be consistent
  }
  // NOTE - instead of pulling in the entire library, including this crcCode by default for empty errors. Should be manageable for us and make implementation easier for userland.
  const isCartPage = getIsPageCart();
  // NOTE I removed declaration of extra const because we only have 1 string at this moment and we should avoid extra code if possible.
  // If this grows a lot... OR we lazy load this we should move to constants.
  const finalErrorsToExclude = isCartPage
    ? errorsToExclude
    : [...errorsToExclude, '7E977FCE', '36A1E761']; // product not buyable in cart // invalid postal code in pdp foff request

  const startTime = Date.now();
  // We will start by setting up locale data asap
  setupLocaleData({ country, language, startTime });
  // NOTE - This function should fire ONLY once per app load.
  // 1. we will first determine what store to observe from outside
  let finalStore = null;

  if (store) {
    finalStore = store;
  }

  // 2. we create a shopInstance with the store - NOTE here's the THIS for this instance
  const shopInstance = new NikeShop({
    store: finalStore,
    language,
    country,
    featureFlags,
  });

  // 3. we will setup our internal reducers
  const reducers = {
    [SHOP_STATE_KEY]: shopReducer,
  };
  // 4. if no final store was present we will create and setup our internal store
  if (!finalStore) {
    // in this case we might not have a cart reducer or wishlist reducer outside so we'll need to add them in
    const { store: ownStore } = createPersistentStore({
      reducers: {
        ...reducers,
        ...addPartnerCartReducer(),
        ...addCartReducer(),
        ...addWishlistReducer(),
      },
    });
    finalStore = ownStore;
    // 5. temporarily while we have to respect other stores we will have an internal store as well which we update here
    shopInstance.updateStore({
      internalStore: ownStore,
    });
  } else {
    const { store: internalStore } = createPersistentStore({ reducers });
    // 6. temporarily we will update internal store here without adding the reducers because finalStore will have the reducer
    shopInstance.updateStore({
      internalStore,
    });
  }
  // 7. this assignment accounts for not overwriting the store in the !finalStore if block (see #5)
  shopInstance.updateStore({
    store: finalStore,
  });

  // 8. we have to assign some callbacks to reuse but they need scope on variables available inside this closure
  const onCartUpdateCallbackWithSideEffects = () =>
    onCartUpdateSideEffects(
      {
        cart: shopInstance.store.getState()[CART_STATE_KEY],
        list: shopInstance.store.getState()[WISHLIST_STATE_KEY],
      },
      onCartUpdate,
    );
  // 9. we also need a fetch call for when NOT merging - currently doing it as a callback due to async with 2nd store + observer
  const fetchCartCallbackWithUserData = userData =>
    shopInstance
      .fetchCart({
        ...rest,
        token: userData.token,
        visitId: userData.visitId,
        visitorId: userData.visitorId,
        force: true,
        bucket: CLOUD_CART_BUCKET,
        country: country?.toUpperCase(),
      }) // there are schema errors from passing in lowercase country to foff + cartReviews
      .then(() => shopInstance.internalStore.dispatch({ type: USER_INITIALIZED }))
      .then(onCartUpdateCallbackWithSideEffects);

  // 10. We will then initialize the user and setup the observer for the store that will drive the cart concerns
  initUserAndObserveStore({
    shopInstance,
    onCartUpdateCallback: onCartUpdateCallbackWithSideEffects,
    fetchCartCallback: fetchCartCallbackWithUserData,
    useListeners,
    errorsToExclude: finalErrorsToExclude,
    warningsToInclude: warningsToIncludeInDialog,
    country,
    startTime,
  });

  const LazyShopApp = loadable(() => import('./shop-app'));

  // 11. we render our ui into the dom element on the page - maybe this can be internalized later but it's safer for now to have a soft implementation requirement
  ReactDOM.render(
    <LazyShopApp
      shopInstance={shopInstance}
      errorsToExclude={finalErrorsToExclude}
      warningsToInclude={warningsToIncludeInDialog}
      language={language}
      country={country}
    />,
    document.getElementById(NIKE_SHOP_ROOT_ID),
  );

  return shopInstance;
}

// NOTE example of listener
// window.addEventListener(CART_COUNT_UPDATED_EVENT_NAME, evt =>
//   console.log('CARTCOUNTEVENT received', evt),
// );
