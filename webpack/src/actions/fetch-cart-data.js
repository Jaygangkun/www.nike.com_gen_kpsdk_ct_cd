import { fetchCart } from '@nike/ux-tread-cart-redux';

import getShellLocale from '../get-shell-locale';
import getCurrentUser from '../selectors/get-current-user';
import trackEvent from '../track-event';

export default args => dispatch => {
  const shellLocale = getShellLocale(); // from shell.locale
  const internalState = window?.NikeShop?.internalStore?.getState() || {};
  const { token, visitorId, visitId } = getCurrentUser(internalState);
  const country = shellLocale?.country?.toUpperCase();
  const localeForCurrency = shellLocale?.hreflang;
  // NOTE langLocale is purely due to tread-cart-redux and supporting legacy code. When we clean it up there we can clean it up here.
  const langLocale = shellLocale?.langRegion?.toLowerCase().replace('-', '_');
  return dispatch(
    fetchCart({
      ...args,
      localeForCurrency,
      langLocale,
      country,
      token,
      visitorId,
      visitId,
    }),
  ).then(data => {
    trackEvent('nike-shop-cart-fetched', null, {
      telemetryData: { country, langLocale, localeForCurrency, operationName: 'getCart' },
      usePageAction: true,
    });
    return data;
  });
};
