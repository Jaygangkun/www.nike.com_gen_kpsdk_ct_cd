import {
    CART_COUNT_UPDATED_EVENT_NAME,
    LOCATION_UPDATED_EVENT_NAME,
    UPDATED_SHOP_DATA_EVENT,
    MERGED_CARTS_EVENT,
  } from '@nike/custom-event-names';
  import {
    CLOSE_SHOP_DIALOG,
    OPEN_SHOP_DIALOG,
    UPDATE_USER_LOCATION_DATA,
    SHOP_STATE_KEY,
    UPDATE_ENTITIES,
  } from './constants';
  import dispatchCustomEvent from './dispatch-custom-event';
  import createCustomEvent from './create-custom-event';
  import onErrorCallback from './on-error-callback';
  import determineAddressVsCountry from './determine-address-vs-country';
  
  // This module will be used after Design/UX decide how to handle location data
  // import getEstimatedLocation from './get-estimated-location';
  
  /**
   * The NikeShop class creates a singleton instance per load via nike-shop-client, exposing some public methods that client experiences can use to interface with apis related to shopping
   *
   * @class
   */
  export default class NikeShop {
    constructor(props) {
      this.store = props.store;
      this.language = props.language;
      this.country = props.country?.toUpperCase();
      this.featureFlags = props.featureFlags;
    }
  
    /**
     * @memberof NikeShop
     * @name NikeShop.getVersion
     * @returns {string} the page instantiated script's module version
     */
    getVersion = () => this.version;
    // maybe we change this to be an abstraction for our telemetry method in the future but for now it gives us a way to get
    // the right version each time.
    onErrorUniteCallback = () => onErrorCallback(this.getVersion());
  
    /**
     * @memberof NikeShop
     * @name NikeShop.addToCart
     * @description add to a user cart with skuId or skuId and designViewId. For additional arguments see reference:
     * @see {@link https://github.com/nike-internal/dotcom.cart-favorites-monorepo/tree/master/packages/ux-tread-cart-redux#addtocart}
     *
     * @param {object} params - named parameters
     * @param {string} params.skuId - a valid sku uuid
     * @param {number} [params.quantity=1] - optional quantity for skuId to add to cart, defaults to 1
     * @param {string} [params.designViewId] -  optional unique identifiers for any customization items.
     * @param {Array} [params.designViewIds] - o array of unique identifiers for any customization items.
     * @param {{ amount: number }} [params.giftCard] - optional gift card object with amount
     * @param {boolean} [params.isDigitalGiftCard] - optional is digital gift card
     * @param {boolean} [params.isPhysicalGiftCard] - optional is physical gift card
     * @param {string}  [params.offer] - optional UUID for exclusive access offer
     * @param {{ firstName: string, lastName: string }} [params.recipient] - optional object containing gift card recipient with firstName and lastName
     * @param {string} [params.recipientEmailAddress] - optional gift card recipient's email
     * @param {string} [params.shippingMethod] - optional shipping method for a gift card
     * @param {Array<{ id: string, instruction: { id: string, type: string }}>} [params.valueAddedServices] - optional vas info for item
     *
     * @returns {Promise} thenable result
     */
    addToCart = ({ quantity = 1, ...args }) =>
      import(/* webpackChunkName: "addToCart" */ './actions/add-to-cart').then(mod => {
        const { default: addToCart } = mod;
        return this.store.dispatch(addToCart({ quantity, ...args }));
      });
  
    addPromotionCode = (args = {}) =>
      import(/* webpackChunkName: "addPromotionCode" */ './actions/add-promotion-code').then(mod => {
        const { default: addPromotionCode } = mod;
        return this.store.dispatch(addPromotionCode(args));
      });
    removePromotionCodes = (args = {}) =>
      import(/* webpackChunkName: "removePromotionCodes" */ './actions/remove-promotion-codes').then(
        mod => {
          const { default: removePromotionCodes } = mod;
          return this.store.dispatch(removePromotionCodes(args));
        },
      );
    /**
     * @memberof NikeShop
     * @name NikeShop.addToWishlist
     * @description add a product with a valid productId, and optional skuId to a user's default wishlist. If the default wishlist doesn't exist this function will ensure creating one prior to the add.
     *
     * @see {@link https://github.com/nike-internal/dotcom.cart-favorites-monorepo/tree/master/packages/wishlist-redux#initializewishlistandaddtocart}
     * @returns {Promise} thenable result
     */
    addToWishlist = (args = {}) =>
      import(/* webpackChunkName: "addToWishlist" */ './actions/add-to-wishlist').then(mod => {
        const { default: addToWishlist } = mod;
        return this.store.dispatch(addToWishlist(args));
      });
  
    addToCartFromWishlist = (args = {}) =>
      import(/* webpackChunkName: "addToCartFromWishlist" */ './actions/add-to-cart-from-wishlist').then(
        mod => {
          const { default: addToCartFromWishlist } = mod;
          return this.store.dispatch(addToCartFromWishlist(args));
        },
      );
    addToWishlistFromCart = (args = {}) =>
      import(/* webpackChunkName: "addToWishlistFromCart" */ './actions/add-to-wishlist-from-cart').then(
        mod => {
          const { default: addToWishlistFromCart } = mod;
          return this.store.dispatch(addToWishlistFromCart(args));
        },
      );
    removeItemsFromWishlist = (args = {}) =>
      import(/* webpackChunkName: "removeItemsFromWishlist" */ './actions/remove-items-from-wishlist').then(
        mod => {
          const { default: removeItemsFromWishlist } = mod;
          return this.store.dispatch(removeItemsFromWishlist(args));
        },
      );
  
    /**
     * @memberof NikeShop
     * @name NikeShop.updateCart
     * @description allows merging carts and patch update the cart with an items array
     * @see {@link https://github.com/nike-internal/dotcom.cart-favorites-monorepo/tree/master/packages/ux-tread-cart-redux#updateCart}
     * @returns {Promise} thenable result
     */
    // updateCart = (args = {}) => this.store.dispatch(updateCart(args)); // NOTE I only found us using it for addToCartFromWishlist
    updateCartItem = (args = {}) =>
      import(/* webpackChunkName: "updateCartItem" */ './actions/update-cart-item').then(mod => {
        const { default: updateCartItem } = mod;
        return this.store.dispatch(updateCartItem(args));
      });
    updateListItem = (args = {}) =>
      import(/* webpackChunkName: "updateListItem" */ './actions/update-list-item').then(mod => {
        const { default: updateListItem } = mod;
        return this.store.dispatch(updateListItem(args));
      });
    fetchMoreListItems = (args = {}) =>
      import(/* webpackChunkName: "fetchMoreListItems" */ './actions/fetch-more-list-items').then(
        mod => {
          const { default: fetchMoreListItems } = mod;
          return this.store.dispatch(fetchMoreListItems(args));
        },
      );
    /**
     * @memberof NikeShop
     * @name NikeShop.fetchCart
     * @description fetch a user's cart
     * @see {@link https://github.com/nike-internal/dotcom.cart-favorites-monorepo/tree/master/packages/ux-tread-cart-redux#fetchCart}
     * @returns {Promise} thenable result
     */
    fetchCart = (args = {}) =>
      import(/* webpackChunkName: "fetchCart" */ './actions/fetch-cart').then(mod => {
        const { default: fetchCart } = mod;
        return this.store.dispatch(fetchCart(args));
      });
    mergeCarts = (args = {}) =>
      import(/* webpackChunkName: "mergeCarts" */ './actions/merge-carts').then(mod => {
        const { default: mergeCarts } = mod;
        return this.store.dispatch(mergeCarts(args));
      });
    initializeWishlist = (args = {}) =>
      import(/* webpackChunkName: "initializeWishlist" */ './actions/initialize-wishlist').then(
        mod => {
          const { default: initializeWishlist } = mod;
          return this.store.dispatch(initializeWishlist(args));
        },
      );
    removeItemFromCart = (args = {}) =>
      import(/* webpackChunkName: "removeItemFromCart" */ './actions/remove-item-from-cart').then(
        mod => {
          const { default: removeItemFromCart } = mod;
          return this.store.dispatch(removeItemFromCart(args));
        },
      );
  
    /**
     * @memberof NikeShop
     * @name NikeShop.getFulfillmentOfferings
     * @description returns a Promise that handles calling services for fulfilment offerings
     * @param {object} params - named parameters
     * @param {string} [params.appId = DOTCOM_UX_ID] - AppId for nike.com (uxid from unite)
     * @param {string} params.appName - App name included in request headers
     * @param {string} [params.cloudStack = 'production'] - cloud stack header
     * @param {string} params.email - users email to go with the async request
     * @param {boolean} params.isCached - should use async fulfillment offering call
     * @param {boolean} [params.isSearch = false] - whether or not to search an area for stores for pickup
     * @param {string} params.locationId - optional location identifier, unique storeId or locationId
     * @param {string} params.locationType - optional the type of location for the locationId, required if locationId is present, store/store_views, ship/pickup_points, location/pick_up_locations
     * @param {Array.<string>} params.offeringTypes - required list of fulfillment offering types to be included, SHIP, PICKUP, INSTORE
     * @param {string} params.productId - required product identifier, unique UUID of the product
     * @param {number} [params.distance = 50] - radius distance to search for stores, defaults to 50 miles for MVP. Only applies when isCached is false.
     * @param {number} [params.timeout = 30000] - optional time to timeout underlying async job api call. Only applies when isCached is false.
     * @param {number} [params.unitOfMeasure='mi'] - unit of measurement to use for distance values, defaults to miles for MVP. Only applies when isCached is false.
     * @returns {Promise}  Result of fulfillment offerings
     *
     * @example <caption>Cached fetchFulfillmentOfferings</caption>
     *  NikeShop.getFulfillmentOfferings({
     *    isCached:true,
     *    productId:'38e0f7bd-fca8-5ad5-93f2-7ba884b7283d',
     *  })
     * @example <caption>Cached fetchFulfillmentOfferings for digital only</caption>
     *  NikeShop.getFulfillmentOfferings({
     *    isCached:true,
     *    productId:'some-digital-gift-card-productId',
     *    offeringTypes: ['DIGITAL'],
     *  })
     * @example <caption>Async fetchFulfillmentOfferings</caption>
     *  NikeShop.getFulfillmentOfferings({
     *    appName:'cart',
     * })
     */
    getFulfillmentOfferings = (params = {}) =>
      import(/* webpackChunkName: "fetchFulfillmentOfferings" */ './actions/fetch-fulfillment-offerings').then(
        mod => {
          const { default: fetchFulfillmentOfferings } = mod;
  
          return this.internalStore.dispatch(fetchFulfillmentOfferings(params)).then(resp => {
            dispatchCustomEvent(
              createCustomEvent(this.get()?.events?.sharedDataUpdated, {
                bubbles: false,
                detail: {
                  offeringItems: this.get()?.offeringItems,
                },
              }),
            );
            return resp;
          });
        },
      );
  
    /**
     * @memberof NikeShop
     * @name NikeShop.getFulfillmentOfferingsCartReviews
     * @description returns a Promise that handles fulfilment offerings + cart reviews
     *
     * @param {object} [params={}] - optional named parameters
     * @param {number} [params.distance = 50] - radius distance to search for stores, defaults to 50 miles for MVP
     * @param {string} params.email - users email to go with the async request
     * @param {boolean} [params.isSearch = false] - whether or not to search an area for stores for pickup
     * @param {Array.<string>} [params.offeringTypes = ['SHIP', 'PICKUP', 'DIGITAL']] - required list of fulfillment offering types to be included. SHIP, PICKUP, DIGITAL, or INSTORE
     * @param {number} [params.timeout = 30000] - optional time to timeout underlying async job api call
     * @param {number} [params.unitOfMeasure='mi'] - unit of measurement to use for distance values, defaults to miles for MVP
     * @returns {Promise}  Result of fulfillment offerings and cart reviews
     */
    getFulfillmentOfferingsCartReviews = (params = {}) =>
      import(/* webpackChunkName: "getFulfillmentOfferingsCartReviews" */ './actions/fetch-fulfillment-offerings-cart-reviews').then(
        mod => {
          const { default: fetchFulfillmentOfferingsCartReviews } = mod;
          return this.internalStore.dispatch(fetchFulfillmentOfferingsCartReviews(params));
        },
      );
  
    getShippingOptionsCartReviews = (params = {}) =>
      import(/* webpackChunkName: "getShippingOptionsCartReviews" */ './actions/fetch-shipping-options-cart-reviews').then(
        mod => {
          const { default: fetchShippingOptionsCartReviews } = mod;
          return this.internalStore.dispatch(fetchShippingOptionsCartReviews(params));
        },
      );
  
    navigateToCheckout = (params = {}) =>
      import(/* webpackChunkName: "navigateToCheckout" */ './actions/navigate-to-checkout').then(
        mod => {
          const { default: navigateToCheckout } = mod;
          return this.internalStore.dispatch(navigateToCheckout(params));
        },
      );
  
    /**
     * @public
     * @memberof NikeShop
     * @name NikeShop.toggleDialog
     * @returns {undefined} toggles ShopDialog open and close
     */
    toggleDialog = ({
      itemId,
      skuId,
      productId,
      showPickupIneligibleMessage,
      fulfillmentType = 'SHIP',
    } = {}) => {
      const isOpen = this.internalStore.getState()?.ui?.isDialogOpen;
  
      return this.internalStore.dispatch({
        type: isOpen ? CLOSE_SHOP_DIALOG : OPEN_SHOP_DIALOG,
        payload: {
          itemId,
          skuId,
          productId,
          showPickupIneligibleMessage,
          fulfillmentType,
        },
      });
    };
  
    fetchProductDetails = (params = {}) =>
      import(/* webpackChunkName: "fetchProductDetails" */ './actions/fetch-product-details').then(
        mod => {
          const { default: fetchProductDetails } = mod;
          return this.internalStore.dispatch(fetchProductDetails(params));
        },
      );
  
    /**
     * @memberof NikeShop
     * @name NikeShop.getProductsInFavorites
     * @description Returns all products that are in a user's favorites list
     *
     * @param {Array.<{productId: string, skuId: ?string}>} products list of products by their id and sku id
     * @returns {Promise} Resulting list of favorited product ids and their associated sku ids. Items that have null for a sku id indicate user has added the item without a size
     *
     */
    getProductsInFavorites = products =>
      import(/* webpackChunkName: "getProductsInFavorites" */ './diff-favorites-from-products').then(
        mod => {
          const { default: diffFavoritesFromProducts } = mod;
          const items = this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.list?.[
            this.country
          ]?.items;
          return diffFavoritesFromProducts(products, items);
        },
      );
  
    /**
     * @memberof NikeShop
     * @name NikeShop.get
     * @returns {NikeShopAccessors} - properties available on object returned by NikeShop.get for consumers of nike-shop-client to use
     *
     * @example <caption>Using accessors for supported values</caption>
     * const cartCount = NikeShop.get().totalCartQuantity;
     * const cartHref = NikeShop.get().cartHref;
     *
     * @example <caption>Using event listeners and preferred pickup location</caption>
     * window.addEventListener(NikeShop.get().events.locationUpdated, ({ detail }) => {
     *   const { postalCode, locationId } = detail;
     *   if(locationId) {
     *     const storeName = NikeShop.get().preferredPickupLocation.name
     *     ...
     *    }
     * });
     */
    get = () => {
      const country = this.country;
      const locationId = this.internalStore.getState()?.[SHOP_STATE_KEY]?.location?.locationId || '';
      return {
        country,
        postalCode:
          this.internalStore.getState()?.[SHOP_STATE_KEY]?.location?.postalCode ||
          this.internalStore.getState()?.[SHOP_STATE_KEY]?.user?.preferredAddress?.postalCode ||
          '',
        locationId,
        locations:
          this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.locationSearchResults || {},
        preferredAddress: determineAddressVsCountry(
          this.internalStore.getState()?.[SHOP_STATE_KEY]?.user?.preferredAddress,
          this.country,
        ),
        preferredPickupLocation:
          this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.locationSearchResults?.[
            locationId
          ]?.details || {},
        promoCodes: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.promoCodes || {},
        cartItems: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.cartItems || {},
        list: {
          id: this.store.getState()?.['@wishlist']?.defaultWishlist?.id,
          name: this.store.getState()?.['@wishlist']?.defaultWishlist?.name,
          listItems: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.listItems,
        },
        vas: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.vas || {},
        cartTotals: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.cartTotals?.[
          country
        ],
        errors: this.internalStore.getState()?.[SHOP_STATE_KEY]?.errors || [],
        warnings: this.internalStore.getState()?.[SHOP_STATE_KEY]?.warnings || [],
        offeringItems:
          this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.offeringItems || {},
        fulfillmentTypes: this.internalStore
          .getState()
          ?.[SHOP_STATE_KEY]?.normalized?.availableFulfillmentTypes?.[
            country
          ]?.fulfillmentTypes?.filter(type => type !== 'INSTORE'),
        availableVas: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.availableVas || {},
        events: {
          locationUpdated: LOCATION_UPDATED_EVENT_NAME,
          sharedDataUpdated: UPDATED_SHOP_DATA_EVENT,
          mergedCarts: MERGED_CARTS_EVENT,
          cartCountUpdated: CART_COUNT_UPDATED_EVENT_NAME,
        },
        cartHref: this.internalStore.getState()?.[SHOP_STATE_KEY]?.shared?.cartHref,
        favoritesHref: this.internalStore.getState()?.[SHOP_STATE_KEY]?.shared?.favoritesHref,
        checkoutHref: this.internalStore.getState()?.[SHOP_STATE_KEY]?.shared?.checkoutHref,
        totalCartQuantity: this.internalStore.getState()?.[SHOP_STATE_KEY]?.normalized?.cart?.[
          country
        ]?.totals?.quantity,
      };
    };
  
    set = (key, params) => {
      switch (key) {
        case 'cartItems': {
          return this.internalStore.dispatch({
            type: UPDATE_ENTITIES,
            payload: { cart: params },
          });
        }
        case 'listItems': {
          return this.internalStore.dispatch({
            type: UPDATE_ENTITIES,
            // payload: { listItems: Object.keys(params).map(id => ({ id, ...params[id] })) }, // or just refactor the wishlistredux module
            payload: { listItems: params },
          });
        }
  
        default:
          return null;
      }
    };
  
    updateStore = ({ store, internalStore }) => {
      this.store = store || this.store;
      this.internalStore = internalStore || this.internalStore;
    };
  
    updateUserLocation = ({ postalCode, locationId }) => {
      // NOTE this area will need to be updated for usage with web-shell
      // this will require understanding the shell-client and communications module from web-shell
      // and whether it will work for consumers NOT using web-shell
      dispatchCustomEvent(
        createCustomEvent(this.get().events?.locationUpdated, {
          bubbles: false,
          detail: { postalCode, locationId },
        }),
      );
      return this.internalStore.dispatch({
        type: UPDATE_USER_LOCATION_DATA,
        payload: { postalCode, locationId },
      });
  
      // This WILL be needed but waiting on Design/UX to decide when/how to get user location data
      // getEstimatedLocation({ postalCode }).then(location => {
      //   this.internalStore.dispatch({
      //     type: UPDATE_USER_LOCATION_DATA,
      //     payload: location,
      //   });
      // });
    };
  }
  