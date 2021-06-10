import identity from './identity';
import getIsPageCart from './get-is-page-cart';
import getUserInitialized from './selectors/get-user-initialized';
import fetchProfile from './actions/fetch-profile';

const initWishlist = ({token})=>window.NikeShop.initializeWishlist({
    appName: window.NikeShop?.getVersion(),
    token,
});

const initializeUser = ({country, userData, onCartUpdate, fetchCartCallback=identity, shopInstance, })=>{
    // NOTE - reminder that this is another area where we need to rethink authentication vs authorization
    // the merging mechanism will potentially require a service change as well
    const fetchFn = userData.isFirstLoad ? window.NikeShop.fetchCart : window.NikeShop.mergeCarts;

    if (userData.isLoggedIn || userData.token) {
        const isUserInitialized = getUserInitialized(shopInstance.internalStore.getState());
        let promise = Promise.resolve();
        if (getIsPageCart() && !isUserInitialized) {
            promise = fetchProfile().then(updatedUserData=>fetchFn(updatedUserData));
        } else {
            promise = fetchFn({
                token: userData.token,
                visitId: userData.visitId,
                visitorId: userData.visitorId,
                country: country?.toUpperCase(),
                // there are schema errors from passing in lowercase country to foff + cartReviews
            });
        }
        return promise.then(onCartUpdate).then(()=>{
            return initWishlist(userData);
        }
        );
    }

    return fetchCartCallback(userData);
}
;

export default initializeUser;
