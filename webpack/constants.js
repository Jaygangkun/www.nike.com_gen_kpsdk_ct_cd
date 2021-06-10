"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ENV_DEFAULTS = exports.UNITE_DEFAULTS = exports.VIEW_IDS = exports.VIEWS = exports.ACCESS_LEVELS = exports.DOTCOM_APP_ID = exports.DOTCOM_TEST_ID = exports.DOTCOM_CLIENT_ID = exports.DEFAULT_UNITE_ID = exports.DEFAULT_LOCALE = exports.UNITE_TEST_CDN = exports.UNITE_CDN = void 0;

var _uxTreadDotcomConstants = require("@nike/ux-tread-dotcom-constants");

var UNITE_CDN = 'https://s3.nikecdn.com/unite/scripts/unite.min.js';
exports.UNITE_CDN = UNITE_CDN;
var UNITE_TEST_CDN = 'https://s3.nikecdn.com/unite-dev/stage/scripts/unite.min.js';
exports.UNITE_TEST_CDN = UNITE_TEST_CDN;
var DEFAULT_LOCALE = 'en_US';
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
var DEFAULT_UNITE_ID = 'nike-unite';
exports.DEFAULT_UNITE_ID = DEFAULT_UNITE_ID;
var DOTCOM_CLIENT_ID = 'HlHa2Cje3ctlaOqnxvgZXNaAs7T9nAuH';
exports.DOTCOM_CLIENT_ID = DOTCOM_CLIENT_ID;
var DOTCOM_TEST_ID = 'XgqbVPs0nNlYZv3fFxx9dummU5SBb5l2';
exports.DOTCOM_TEST_ID = DOTCOM_TEST_ID;
var DOTCOM_APP_ID = 'i4h4OXhiRBW0kGA4ovgt4HXdwGsngNKR';
/**
 * Access level keyed with semantic names
 *
 * @type {object}
 */

exports.DOTCOM_APP_ID = DOTCOM_APP_ID;
var ACCESS_LEVELS = {
    purchase: 'A',
    edit: 'B',
    // sometimes reauth
    shop: 'C',
    // reauth
    unauthenticated: 'D'// login

};
/**
 * keys for all the valid views
 *
 * @type {object}
 */

exports.ACCESS_LEVELS = ACCESS_LEVELS;
var VIEWS = {
    appLanding: 'appLanding',
    confirmPasswordReset: 'confirmPasswordReset',
    error: 'error',
    join: 'join',
    link: 'link',
    login: 'login',
    loginContinuity: 'loginContinuity',
    loginDropdown: 'loginDropdown',
    mobileVerificationCode: 'mobileVerificationCode',
    none: 'none',
    progressive: 'progressive',
    reauth: 'reauth',
    resetPassword: 'resetPassword',
    socialJoin: 'socialJoin',
    updatePassword: 'updatePassword'
};
/**
 * All the ids for different views available through unite
 *
 * @type {Array}
 */

exports.VIEWS = VIEWS;
var VIEW_IDS = ['nike-unite-app-landing-view', 'nike-unite-confirm-password-reset-view', 'nike-unite-error-view', 'nike-unite-join-view', 'nike-unite-link-view', 'nike-unite-link-no-email-view', 'nike-unite-login-view', 'nike-unite-login-continuity-view', 'nike-unite-login-dropdown-view', 'nike-unite-mobile-verification-code-view', 'nike-unite-progressive-profile-view', 'nike-unite-reauth-view', 'nike-unite-reset-password-view', 'nike-unite-update-password-view'];
/**
 * Default config for unite script
 *
 * @type {object}
 */

exports.VIEW_IDS = VIEW_IDS;
var UNITE_DEFAULTS = {
    type: 'text/javascript',
    async: true,
    id: DEFAULT_UNITE_ID,
    locale: DEFAULT_LOCALE,
    allowqueryparams: true
};
/**
 * Dev/Prod env configs for unite script
 *
 * @type {object}
 */

exports.UNITE_DEFAULTS = UNITE_DEFAULTS;
var ENV_DEFAULTS = {
    dev: {
        src: UNITE_TEST_CDN,
        clientid: DOTCOM_TEST_ID,
        environment: 'ci',
        backendenvironment: 'identityInt'
    },
    prod: {
        src: UNITE_CDN,
        clientid: DOTCOM_CLIENT_ID,
        id: DEFAULT_UNITE_ID,
        uxid: _uxTreadDotcomConstants.DOTCOM_UX_ID,
        backendenvironment: 'identity',
        environment: 'production',
        allowqueryparams: true,
        locale: DEFAULT_LOCALE
    }
};
exports.ENV_DEFAULTS = ENV_DEFAULTS;
