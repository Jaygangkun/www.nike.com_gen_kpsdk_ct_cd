// The following hook handles the input values for EDD Delivery and Pickup form values
export const FETCH_START = 'FETCH_START';
export const FETCH_DONE = 'FETCH_DONE';
export const SET_POSTAL_CODE = 'SET_POSTAL_CODE';
export const SET_LOCATION_ID = 'SET_LOCATION_ID';

export const postalCodeFormReducer = (state, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, isLoading: true };
    case FETCH_DONE:
      return { ...state, hasError: action.payload.hasError, isLoading: false };
    case SET_POSTAL_CODE:
      return {
        ...state,
        hasError: action.payload.hasError,
        postalCodeValue: action.payload.postalCodeValue,
      };
    case SET_LOCATION_ID:
      return {
        ...state,
        hasError: action.payload.hasError,
        locationId: action.payload.locationId,
      };
    default:
      return state;
  }
};
