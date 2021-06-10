"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rejectError = rejectError;
exports.onUniteInit = onUniteInit;
exports.getUnite = getUnite;
exports.getCredential = getCredential;
exports.getUserProfileWithForceRefresh = getUserProfileWithForceRefresh;
exports.getVisitData = getVisitData;
exports.getAccessLevel = getAccessLevel;
exports.getUserProfile = getUserProfile;
exports.getUserState = getUserState;
exports.sessionLogout = sessionLogout;
exports.onLoginSuccess = onLoginSuccess;
exports.onLoginSuccessRemoveHandler = onLoginSuccessRemoveHandler;
exports.onLoginFailure = onLoginFailure;
exports.onJoinSuccess = onJoinSuccess;
exports.onJoinSuccessRemoveHandler = onJoinSuccessRemoveHandler;
exports.onJoinFailure = onJoinFailure;

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

/**
 *
 */
function rejectError(reject) {
    return function(result, code) {
        reject({
            result: result,
            code: code
        });
    }
    ;
}
/**
 *
 */

function onUniteInit(fn) {
    return window.addEventListener('nikeUniteInit', fn, false);
}
/**
 * getUnite resolves window.nike.unite safely or adds nikeUniteInit event listener
 *
 * @returns {Promise} resolves unite object in the window
 */

function getUnite() {
    return new Promise(function(resolve) {
        if (window && window.nike && window.nike.unite && window.nike.unite.isInitialized) {
            return resolve(window.nike.unite);
        }
        // what if window isn't available

        return onUniteInit(function() {
            return resolve(window.nike.unite);
        });
    }
    );
}
/**
 * getCredential calls getUnite and resolves the result of session.getCredential
 *
 * @returns {Promise} resolves auth obj which contains access_token & user_id
 */

function getCredential() {
    return new Promise(function(resolve, reject) {
        getUnite().then(function(unite) {
            unite.session.getCredential(resolve, rejectError(reject));
        });
    }
    );
}
/**
 *
 */

function getUserProfileWithForceRefresh() {
    return new Promise(function(resolve, reject) {
        var mergeUserType = function mergeUserType(profileResult, userType) {
            // The profile result may be different depending on backend (CAM/identity).
            // This is an attempt to normalize the result.
            var profile = profileResult.entity || profileResult;
            return resolve(_objectSpread(_objectSpread({}, profile), {}, {
                ID: profile.id,
                userType: userType
            }));
        };

        getUnite().then(function(unite) {
            unite.session.getUserProfileWithForceRefresh(mergeUserType, rejectError(reject));
        });
    }
    );
}
/**
 * getVisitData calls getUnite and resolves the result of session.getVisitData
 *
 * @returns {Promise} resolves sessionData obj which contains visitor_id and visits
 */

function getVisitData() {
    return new Promise(function(resolve, reject) {
        getUnite().then(function(unite) {
            unite.session.getVisitData(resolve, rejectError(reject));
        });
    }
    );
}
/**
 * getAccessLevel calls getUnite and resolves the result of session.getAccessLevel
 *
 * @returns {Promise} resolves the action levels A, B, C or D
 */

function getAccessLevel() {
    return new Promise(function(resolve, reject) {
        getUnite().then(function(unite) {
            unite.session.getAccessLevel(resolve, rejectError(reject));
        });
    }
    );
}
/**
 * getUserProfile calls getUnite and resolves the result of session.getUserProfile
 *
 * @returns {Promise} resolves profile obj merged with user_type
 */

function getUserProfile() {
    return new Promise(function(resolve, reject) {
        var mergeUserType = function mergeUserType(profileResult, userType) {
            // The profile result may be different depending on backend (CAM/identity).
            // This is an attempt to normalize the result.
            var profile = profileResult.entity || profileResult;
            return resolve(_objectSpread(_objectSpread({}, profile), {}, {
                ID: profile.upmId || profile.id,
                userType: userType
            }));
        };

        getUnite().then(function(unite) {
            unite.session.getUserProfile(mergeUserType, rejectError(reject));
        });
    }
    );
}
/**
 * getUserState calls getUnite with a key and action
 * resolving the result of session.getUserState
 *
 * @param  {string} key -  valid keys: isMobileVerified|isSwooshUser|isLegallyCompliant
 * @param  {Function} onSuccess - a function called on success with key or null
 * @returns {Promise}  resolves with result of onSuccess call
 */

function getUserState(key, onSuccess) {
    return new Promise(function(resolve, reject) {
        getUnite().then(function(unite) {
            unite.api.user.getState(key, onSuccess, rejectError(reject));
        });
    }
    );
}
/**
 * sessionLogout calls getUnite and resolves the result of session.logout
 *
 * @returns {Promise} resolves the result of logout
 */

function sessionLogout() {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.session.logout(resolve);
        });
    }
    );
}
/**
 * add login success handler to the unite object
 *
 * @param {Function} fn
 * @returns {Promise}
 */

function onLoginSuccess(fn) {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.on.login.success.addHandler(fn);
        }).then(resolve);
    }
    );
}
/**
 * on login success remove a given handler
 *
 * @param {Function} fn
 * @returns {Promise}
 */

function onLoginSuccessRemoveHandler(fn) {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.on.login.success.removeHandler(fn);
        }).then(resolve);
    }
    );
}
/**
 * add login failure handler to the unite object
 *
 * @param {Function} fn
 * @returns {Promise}
 */

function onLoginFailure(fn) {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.on.login.fail.addHandler(fn);
        }).then(resolve);
    }
    );
}
/**
 * add join success handler to the unite object
 *
 * @param {Function} fn
 * @returns {Promise}
 */

function onJoinSuccess(fn) {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.on.join.success.addHandler(fn);
        }).then(resolve);
    }
    );
}
/**
 * on join success remove a given handler
 *
 * @param {Function} fn
 * @returns {Promise}
 */

function onJoinSuccessRemoveHandler(fn) {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.on.join.success.removeHandler(fn);
        }).then(resolve);
    }
    );
}
/**
 * add join failure handler to the unite object
 *
 * @param {Function} fn
 * @returns {Promise}
 */

function onJoinFailure(fn) {
    return new Promise(function(resolve) {
        getUnite().then(function(unite) {
            unite.on.join.fail.addHandler(fn);
        }).then(resolve);
    }
    );
}
