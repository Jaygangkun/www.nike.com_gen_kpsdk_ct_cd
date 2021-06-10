import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import loadable from '@loadable/component';
import { CART_DIALOG_ROOT_ID } from './constants';

const LazyCartErrorWarningDialog = loadable(() =>
  import('./components/error-warning-dialog/ConnectedCartErrorWarningDialog'),
);

const LazyShopDialog = loadable(() => import('./components/shop-dialog'));
const LazyShopErrorDialog = loadable(() =>
  import('./components/error-warning-dialog/ConnectedShopErrorDialog.js'),
);

const ShopApp = ({ country, errorsToExclude, language, shopInstance, warningsToInclude }) => (
  <>
    <Provider store={shopInstance.store}>
      <LazyCartErrorWarningDialog
        language={language}
        country={country}
        errorsToExclude={errorsToExclude}
        warningsToInclude={warningsToInclude}
      />
    </Provider>
    <Provider store={shopInstance.internalStore}>
      <>
        <LazyShopDialog language={language} />
        <LazyShopErrorDialog
          language={language}
          country={country}
          errorsToExclude={errorsToExclude}
        />
      </>
    </Provider>
    <div data-version={shopInstance?.version} id={CART_DIALOG_ROOT_ID} />
  </>
);

ShopApp.propTypes = {
  shopInstance: PropTypes.shape({
    store: PropTypes.shape({}),
    internalStore: PropTypes.shape({}),
    version: PropTypes.string,
  }),
  language: PropTypes.string,
  country: PropTypes.string,
  errorsToExclude: PropTypes.arrayOf(PropTypes.string),
  warningsToInclude: PropTypes.arrayOf(PropTypes.string),
};

export default ShopApp;
