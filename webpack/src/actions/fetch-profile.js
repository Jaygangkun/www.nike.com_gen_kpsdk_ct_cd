import {fetchUserData} from '@nike/ux-tread-identity';
import getCurrentUser from '../selectors/get-current-user';
import {FETCH_IDENTITY_DATA_FAILURE, FETCH_IDENTITY_DATA_SUCCESS, FETCH_IDENTITY_DATA, } from '../constants';
import trackEvent from '../track-event';
import getShellLocale from '../get-shell-locale';

/**
 * @private
 * getPreferredAddress selects the priority address from a member's address list returned
 * from the identity service. This address will be used for EDD/BOPIS determination.
 *
 * @returns {object} member address data meant for EDD/BOPIS values
 */
export function getPreferredAddress(addresses, localeCountry) {
    const address = // Get preferred or shipping label address. If no preferred or label matching address just grab the first one.
    addresses.filter(addr=>addr?.preferred || addr?.label === 'shipping')[0] || addresses?.[0];
    return address?.country === localeCountry ? address : {};
    // Only return address if it matches the current client geo.
}

/**
 * @private
 * fetchProfile retrieves more user data via identity service
 * and updates user state for experiences that need more information such as shipping
 *
 * @returns {Function} thunk that calls getUserProfile method
 */
export default function fetchProfile() {
    const shopInstance = window?.NikeShop;
    const internalStore = shopInstance?.internalStore;
    const internalState = internalStore?.getState() || {};
    const {token, upmId, isLoggedIn} = getCurrentUser(internalState);

    if (!token || !isLoggedIn) {
        return internalStore.dispatch({
            type: FETCH_IDENTITY_DATA_FAILURE,
            payload: 'No auth token available.',
        });
    }

    const startTime = Date.now();
    const locale = getShellLocale();
    const localeCountry = locale.country?.toUpperCase();
    internalStore.dispatch({
        type: FETCH_IDENTITY_DATA,
    });
    return fetchUserData(token, {
        upmId,
    }).then(response=>{
        const address = getPreferredAddress(response, localeCountry);
        // NOTE these are the minimum expected fields for Shipping Options schema today and the known inputs we finished for fulfillment options
        // Shipping opts https://bitbucket.nike.com/projects/CICEXP/repos/grand/browse/packages/gp-buy-shipping-options-v2/mutation-types.graphql#5-15
        // Fulfillment ops https://bitbucket.nike.com/projects/CICEXP/repos/grand/browse/packages/gp-buy-fulfillment-offerings-job-v1/mutation-types.graphql#67-76
        const payload = {
            city: address.locality,
            state: address.province,
            postalCode: address.code,
            country: address.country,
            address1: address.line1,
            address2: address.line2,
            address3: address.line3,
            email: address.email,
        };
        trackEvent('nike-shop-profile-fetched', null, {
            telemetryData: {
                msSinceRequest: Date.now() - startTime,
            },
            usePageAction: true,
        });
        return internalStore.dispatch({
            type: FETCH_IDENTITY_DATA_SUCCESS,
            payload,
        });
    }
    , error=>internalStore.dispatch({
        type: FETCH_IDENTITY_DATA_FAILURE,
        error,
    }), );
}
