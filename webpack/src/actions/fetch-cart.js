export default args => dispatch => {
    if (window.NikeShop?.featureFlags?.useAggregateFetchCart) {
      return import(/* webpackChunkName: "fetch-cart-design-views-skus" */ './fetch-cart-design-views-skus').then(
        mod => {
          const { default: fetchCartDesignViewsSkus } = mod;
          return dispatch(fetchCartDesignViewsSkus(args));
        },
      );
    }
    return import(/* webpackChunkName: "fetch-cart-data" */ './fetch-cart-data').then(mod => {
      const { default: fetchCartData } = mod;
      return dispatch(fetchCartData(args));
    });
  };
  