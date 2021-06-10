import {normalize} from 'normalizr';
import {combineReducers} from 'redux';
import foffJobsCrcCodes from '@nike/ux-tread-crc-code/lib/buy/fulfillment_offerings_jobs/v1/crcCodes';
import {FETCH_CARTS_FAILURE, FETCH_CARTS_SUCCESS} from '@nike/cart-constants';
import {INITIALIZE_WISHLIST_SUCCESS} from '@nike/wishlist-redux';
import {persistToLocalStorage, persistToSessionStorage} from '@nike/ux-tread-web-storage';

import {ON_FETCH_START, CLEAR_ERRORS, CLEAR_IDENTITY_DATA, CLOSE_SHOP_DIALOG, FETCH_IDENTITY_DATA_SUCCESS, ON_FETCH_FAILURE, ON_FULFILLMENT_OFFERINGS_SUCCESS, OPEN_SHOP_DIALOG, UPDATE_ENTITIES, UPDATE_SHARED_DATA, UPDATE_SHOP_USER, UPDATE_USER_LOCATION_DATA, ON_SHIPPING_OPTIONS_SUCCESS, UPDATE_SHOP_USER_TYPE, CLEAR_NORMALIZED_DATA, } from './constants';
import {dataSchema} from './schemas';
import deepStateMerge from './deep-state-merge';

export const normalizeAndMergeState = (dataToNormalize={},state,keysToExcludeFromMerge=[],)=>{
    const normalized = normalize(dataToNormalize, dataSchema);
    const {result, entities} = normalized || {};
    const {errors, data, ...rest} = entities || {};
    const entitiesToMerge = Object.keys(rest).reduce(deepStateMerge(state, rest, keysToExcludeFromMerge), {}, );
    return {
        ...state,
        ...entitiesToMerge,
        result: {
            ...state.result,
            ...(result || {}),
        },
    };
}
;

const errorsReducer = (state=[],action={})=>{
    switch (action.type) {
    case ON_FETCH_FAILURE:
        {
            return [...state, {
                code: action.payload?.code,
                message: action.payload?.message,
                crcCode: action.payload?.crcCode,
                itemId: action.payload?.itemId,
            }, ];
        }
    case CLEAR_ERRORS:
        return [...state.filter(// This error has UI associated with it. The user cannot clear this
        // error without deliberately removing the offending item from their cart.
        // Therefor, we can't delete this error from the local store and it must be
        // removed with a successful API response
        errorWarning=>errorWarning.crcCode === foffJobsCrcCodes.FULFILLMENT_OFFERINGS_NOT_FOUND, ), ];
    case ON_FULFILLMENT_OFFERINGS_SUCCESS:
        return [...state.filter(// If an F/Off API response comes back successful we must manually remove previous errors
        errorWarning=>errorWarning.crcCode !== foffJobsCrcCodes.FULFILLMENT_OFFERINGS_NOT_FOUND, ), ];

        // If we keep around state from old f/off calls, we'll just accumulate a lot of errors.
        // ON_FETCH_START can be triggered by other calls, but we'll regain errors from API responses.
    case ON_FETCH_START:
        return [];

    default:
        return state;
    }
}
;

const warningsReducer = (state=[],action={})=>{
    switch (action.type) {
    case ON_FULFILLMENT_OFFERINGS_SUCCESS:
        {
            return action.payload.fulfillmentOfferings?.warnings || [];
        }
    default:
        return state;
    }
}
;

const userReducer = (state={},action={})=>{
    switch (action.type) {
    case UPDATE_SHOP_USER_TYPE:
        return {
            ...state,
            ...action.payload,
        };
    case UPDATE_SHOP_USER:
        {
            const {visitorId, visitId, token, upmId, userType} = action.payload;
            return {
                ...state,
                isLoggedIn: Boolean(token),
                upmId,
                visitorId,
                visitId,
                token,
                userType
            };
        }
    case FETCH_IDENTITY_DATA_SUCCESS:
        {
            return {
                ...state,
                userInitialized: true,
                preferredAddress: action.payload,
            };
        }
    case CLEAR_IDENTITY_DATA:
        {
            return {
                ...state,
                userInitialized: false,
                preferredAddress: {}
            };
        }
    default:
        return state;
    }
}
;

const sharedStateReducer = (state={},action={})=>{
    switch (action.type) {
    case UPDATE_SHARED_DATA:
        return {
            ...state,
            ...action.payload,
        };

    default:
        return state;
    }
}
;

const locationReducer = (state={},action={})=>{
    switch (action.type) {
    case UPDATE_USER_LOCATION_DATA:
        return {
            ...state,
            ...action.payload
        };
    default:
        return state;
    }
}
;

const shopUiReducer = (state={
    isDialogOpen: false,
},action={},)=>{
    switch (action.type) {
    case OPEN_SHOP_DIALOG:
        return {
            ...state,
            ...action?.payload,
            isDialogOpen: true,
        };
    case CLOSE_SHOP_DIALOG:
        return {
            ...state,
            ...action?.payload,
            isDialogOpen: false,
        };

    default:
        return state;
    }
}
;

const shopAppReducer = (state={
    wishlistInitialized: false,
    cartFetched: false,
},action={},)=>{
    switch (action.type) {
    case INITIALIZE_WISHLIST_SUCCESS:
        return {
            ...state,
            wishlistInitialized: true
        };
    case FETCH_CARTS_FAILURE:
    case FETCH_CARTS_SUCCESS:
        return {
            ...state,
            cartFetched: true
        };
    default:
        return state;
    }
}
;

const normalizedReducer = (state={
    result: {}
},action={})=>{
    switch (action.type) {
    case ON_FETCH_FAILURE:
        {
            const partialError = action.payload?.data;
            // because fetch client will return us normalized error shapes with data we can use that
            // to recover any partial data response using payload.data.<entity>
            return normalizeAndMergeState(partialError?.data || partialError, state);
        }

    case ON_SHIPPING_OPTIONS_SUCCESS:
    case ON_FULFILLMENT_OFFERINGS_SUCCESS:
    case UPDATE_ENTITIES:
        {
            // NOTE - need to enhance this area or move normalize function call to actions
            // NOTE - flickers are being caused by a blanket merge here.. a deep merge would allow
            // we want these values to be overwritten with each fetch of foffs, do not merge with current state
            const keysToExcludeFromMerge = ['offeringItems', 'locations', 'promoCodes'];
            return normalizeAndMergeState(action.payload, state, keysToExcludeFromMerge);
        }

    case CLEAR_NORMALIZED_DATA:
        return {
            result: {}
        };
    default:
        return state;
    }
}
;

export default combineReducers({
    user: persistToSessionStorage('user', userReducer, {
        blacklist: ['token', 'userInitialized']
    }),
    warnings: warningsReducer,
    errors: errorsReducer,
    location: persistToLocalStorage('location', locationReducer),
    normalized: persistToSessionStorage('normalized', normalizedReducer, {
        blacklist: ['promoCodes'],
    }),
    ui: shopUiReducer,
    app: shopAppReducer,
    shared: persistToLocalStorage('shared', sharedStateReducer),
});
