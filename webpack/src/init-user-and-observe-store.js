import { getUnite } from '@nike/ux-tread-unite';

import { logoutSuccess } from '@nike/ux-tread-unite-redux';
import {
  isConfigSet,
  getCartQuantity,
  clearCartState,
  ON_INIT_CART,
} from '@nike/ux-tread-cart-redux';
import { NIKE_DOTCOM_HOST } from '@nike/ux-tread-dotcom-constants';
import { clearWishlistState, WISHLIST_STATE_KEY } from '@nike/wishlist-redux';
import { toggleBodyOverflow } from '@nike/ux-tread-dotcom-utils';

import { CART_COUNT_UPDATED_EVENT_NAME, UPDATED_SHOP_DATA_EVENT } from '@nike/custom-event-names';
import { addPageAction } from '@nike/ux-tread-new-relic';
import { CART_STATE_KEY } from '@nike/cart-constants';

import {
  CLEAR_IDENTITY_DATA,
  UPDATE_SHOP_USER,
  UPDATE_SHARED_DATA,
  UPDATE_SHOP_USER_TYPE,
  CLEAR_NORMALIZED_DATA,
} from './constants';
import getHasCartErrorsOrWarnings from './selectors/get-has-cart-errors-or-warnings';
import observeStore from './observe-store';

import getCurrentUser from './selectors/get-current-user';
import dispatchCustomEvent from './dispatch-custom-event';
import createCustomEvent from './create-custom-event';
import initializeUser from './initialize-user';
import onMemberJoinLoginSuccess from './on-member-join-login-success';
import onCartUpdateSideEffects from './on-cart-update-side-effects';
import getShellLocale from './get-shell-locale';
import getUserType from './private/get-user-type';
import appendToHref from './append-to-href';

// NOTE - inside this function is also possibly where our interaction with CS user (admin vs unite) will come into play
const initUserAndObserveStore = ({
  shopInstance,
  onCartUpdateCallback,
  fetchCartCallback,
  country,
  useListeners,
  errorsToExclude,
  warningsToInclude,
  startTime,
}) => {
  const onErrorCallback = shopInstance.onErrorUniteCallback;
  // we are going to set a variable for the default start of cartCount (events, observer also need this)
  let cartCount = 0;
  // we are going directly to raw unite to setup our own handlers and invoke the first fetching flow
  // NOTE unite documentation lives at https://confluence.nike.com/display/USER/Unite+Web+SDK+-+Developer+Documentation
  // you can reference it but I would not invest in it since sdk is going away very soon and is only semi reliable
  return getUnite().then(unite => {
    addPageAction('nike-shop-unite-event', {
      version: window?.NikeShop?.version,
      loadTime: Date.now() - startTime,
      status: 'Initialized',
      userType: getUserType(shopInstance),
    });
    // setting up our on join handler
    unite.on.join.success.addHandler(
      onMemberJoinLoginSuccess({
        session: unite.session,
        shopInstance,
        country,
        onCartUpdateCallback,
        fetchCartCallback,
        onErrorCallback,
      }),
      onErrorCallback,
    );
    // setting up our on login handler
    unite.on.login.success.addHandler(
      onMemberJoinLoginSuccess({
        session: unite.session,
        shopInstance,
        country,
        onCartUpdateCallback,
        fetchCartCallback,
        onErrorCallback,
      }),
      onErrorCallback,
    );
    // setting up our on logout handler
    unite.on.logout.addHandler(() => {
      shopInstance.store.dispatch(clearCartState());
      shopInstance.store.dispatch(clearWishlistState());
      shopInstance.store.dispatch(logoutSuccess());
      shopInstance.internalStore.dispatch({
        type: UPDATE_SHOP_USER,
        payload: {},
      });
      shopInstance.internalStore.dispatch({ type: CLEAR_IDENTITY_DATA });
      shopInstance.internalStore.dispatch({ type: CLEAR_NORMALIZED_DATA });
    });

    // check for swoosh status
    unite.api.user.getState(
      'isSwooshUser',
      isSwooshUser => {
        if (isSwooshUser) {
          return shopInstance.internalStore.dispatch({
            type: UPDATE_SHOP_USER_TYPE,
            payload: { isSwooshUser, userType: 'Swoosh' },
          });
        }
        return shopInstance.internalStore.dispatch({
          type: UPDATE_SHOP_USER_TYPE,
          payload: { isSwooshUser },
        });
      },
      onErrorCallback,
    );

    // check for mobile verification status
    unite.api.user.getState(
      'isMobileVerified',
      isMobileVerified =>
        shopInstance.internalStore.dispatch({
          type: UPDATE_SHOP_USER_TYPE,
          payload: { isMobileVerified },
        }),
      onErrorCallback,
    );

    // our user async flow to determine whether it's a guest or not
    return unite.session.getCredential(auth => {
      let userData = {};
      if (auth) {
        const { user_id: upmId, access_token: token } = auth;
        userData = {
          ...userData,
          upmId,
          token,
          isLoggedIn: Boolean(token),
        };
      }

      return unite.session.getVisitData(sessionData => {
        const { visitor: visitorId, visit: visitId } = sessionData;
        userData = {
          ...userData,
          userType: userData.isLoggedIn ? 'Member' : 'Guest',
          visitorId,
          visitId,
        };

        // set the user to our own internal state to consistently lookup internally
        shopInstance.internalStore.dispatch({
          type: UPDATE_SHOP_USER,
          payload: userData,
        });

        let attempted = false;
        // NOTE not setting hrefs here by default as we need to know to do it once only
        let cartHref = '';
        let favoritesHref = '';
        let checkoutHref = '';
        const locale = getShellLocale();
        const langLocale = locale?.langRegion?.toLowerCase().replace('-', '_'); // NOTE This is due to cart-redux and when we clean it up there we can clean it up here
        const localeForCurrency = locale?.hreflang;
        // NOTE this is to fix dotcomNav from our end, will need to go away once we clean up consumer used code
        shopInstance.store.dispatch({
          type: ON_INIT_CART,
          payload: { country: shopInstance.country },
          meta: {
            langLocale,
            localeForCurrency,
            currency: locale?.currency,
            isLoggedIn: userData.isLoggedIn,
          },
        });

        observeStore(shopInstance.store, state => {
          // determine if cart is initialized already
          const configSet = isConfigSet(state);
          const nextCartCount = getCartQuantity(shopInstance.store.getState());

          // The following check is to ensure that we have not already set the href values as they start out empty
          if (!cartHref) {
            // NOTE locale itself can be an empty object if there are geoloc cookie mismatches via nav..
            // so we are checking for a value we need for translations and we expect to have with locale data
            if (locale?.hreflang) {
              const urlLocale = locale?.cloudUrlFragment;
              const urlLocaleFragment = urlLocale ? `/${urlLocale}/` : '/';
              cartHref = `${NIKE_DOTCOM_HOST}${urlLocaleFragment}cart`;
              favoritesHref = `${NIKE_DOTCOM_HOST}${urlLocaleFragment}favorites`;
              checkoutHref = `${NIKE_DOTCOM_HOST}${urlLocaleFragment}checkout`;
            } else {
              // NOTE rather than setting these values by default we only fall back to shaping the hrefs if we are missing the locale information necessary
              cartHref = appendToHref('cart');
              favoritesHref = appendToHref('favorites');
              checkoutHref = appendToHref('checkout');
            }
            // set the user to our own internal state to consistently lookup internally
            const payload = {
              ...locale,
              cartHref,
              favoritesHref,
              checkoutHref,
            };
            shopInstance.internalStore.dispatch({
              type: UPDATE_SHARED_DATA,
              payload,
            });
            if (useListeners) {
              const updatedSharedDataEvent = createCustomEvent(UPDATED_SHOP_DATA_EVENT, {
                bubbles: true,
                detail: { cartHref, favoritesHref, checkoutHref },
              });
              dispatchCustomEvent(updatedSharedDataEvent);
            }
          }

          const currentUser = getCurrentUser(shopInstance.internalStore.getState());
          // We need to fetch cart at least ONCE and so if nothing outside has fetched cart we'll do this here.
          // However since we ourselves are invoking fetchCart, when no config is set you might fetch multiple times
          // inside the observer before the config gets set. We are using the `attempted` variable to keep track.
          if (!configSet && !attempted && (currentUser.token || currentUser.visitorId)) {
            attempted = true;
            // fetch and initialize cart if is has not already been done
            fetchCartCallback(currentUser);
          }

          if (cartCount !== nextCartCount) {
            cartCount = getCartQuantity(shopInstance.store.getState());

            // NOTE: When GLOBAL NAV starts to use our custom event,
            // We need to check with Greg about removing the nav portion inside the sideeffect function
            onCartUpdateSideEffects({
              cart: shopInstance.store.getState()[CART_STATE_KEY],
              list: shopInstance.store.getState()[WISHLIST_STATE_KEY],
            });

            // We are not ready to put this out there openly but custom event dispatching can be an alternate way
            // and potentially future way of how we communicate updates to other apps. Flagged behind useListeners currently.
            // However we can introduce it into the codebase for testing in dark prod and on other apps.
            if (useListeners) {
              const cartCountEvent = createCustomEvent(CART_COUNT_UPDATED_EVENT_NAME, {
                bubbles: true,
                detail: { cartCount },
              });
              dispatchCustomEvent(cartCountEvent);
            }
          }

          // check if there are any errors
          const hasCartErrors = getHasCartErrorsOrWarnings(state, {
            errorsToExclude,
            warningsToInclude,
          });

          // toggleBodyOverflow will turn on and off based on if there are errors
          toggleBodyOverflow(hasCartErrors);
        });
        return initializeUser({
          country,
          userData: { ...userData, isFirstLoad: true },
          onCartUpdate: onCartUpdateCallback,
          fetchCartCallback,
          shopInstance,
        });
      }, onErrorCallback);
    }, onErrorCallback);
  });
};

export default initUserAndObserveStore;
