import onGetVisitDataSuccess from './on-get-visit-data-success';

const onMemberJoinLoginSuccess = ({session, shopInstance, country, onCartUpdateCallback, fetchCartCallback, onErrorCallback, startTime, })=>auth=>{
    let userData = {
        isLoggedIn: false,
        userType: 'Guest',
    };
    if (auth?.access_token) {
        const {user_id: upmId, access_token: accessToken} = auth;
        userData = {
            userType: 'Member',
            upmId,
            token: accessToken,
            isLoggedIn: true,
        };
    }
    return session.getVisitData(onGetVisitDataSuccess({
        startTime,
        userData,
        shopInstance,
        country,
        onCartUpdateCallback,
        fetchCartCallback,
    }), onErrorCallback, );
}
;

export default onMemberJoinLoginSuccess;
