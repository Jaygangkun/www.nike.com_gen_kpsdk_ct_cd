import {addPageAction} from '@nike/ux-tread-new-relic';
import {UPDATE_SHOP_USER} from './constants';
import initializeUser from './initialize-user';
import getUserType from './private/get-user-type';

const onGetVisitDataSuccess = ({userData, shopInstance, country, onCartUpdateCallback, fetchCartCallback, startTime, })=>sessionData=>{
    const {visitor: visitorId, visit: visitId} = sessionData;
    const updatedUserData = {
        visitorId,
        visitId,
        userType: userData.isLoggedIn ? 'Member' : 'Guest',
        ...userData,
    };

    shopInstance.internalStore.dispatch({
        type: UPDATE_SHOP_USER,
        payload: updatedUserData,
    });

    addPageAction('nike-shop-unite-event', {
        version: window?.NikeShop?.version,
        loadTime: Date.now() - startTime,
        status: userData.isLoggedIn ? 'Member' : 'Guest',
        userType: getUserType(shopInstance),
    });

    return initializeUser({
        country,
        userData: updatedUserData,
        onCartUpdate: onCartUpdateCallback,
        fetchCartCallback,
        shopInstance,
    });
}
;

export default onGetVisitDataSuccess;
