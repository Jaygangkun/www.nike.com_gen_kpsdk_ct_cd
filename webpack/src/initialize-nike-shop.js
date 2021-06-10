import {canUseDOM} from 'exenv';

/**
 * @private
 * @ignore
 * lazy loads bootstrapNikeShop, invokes it and defines NikeShop as a global property on window with the created instance
 *
 * @returns {Promise} a dynamic import promise that code splits the bigger chunks from the entry file, resolving the new NikeShop instance
 */
function init(...args) {
    return import(/* webpackChunkName: "bootstrap-nike-shop" */
    './bootstrap-nike-shop.js').then(mod=>{
        const {default: bootstrapNikeShop} = mod;

        const shopInstance = bootstrapNikeShop(...args);
        Object.defineProperty(window, 'NikeShop', {
            value: shopInstance
        });
        // NOTE - we are moving the tagging up here to avoid changing hash for bigger file
        Object.defineProperty(shopInstance, 'version', {
            value: process.env.PACKAGE_VERSION
        });
        return shopInstance;
    }
    , );
}

/**
 * @private
 * @ignore
 * defines initNikeShop as a global property on window
 */
export default function initNikeShop() {
    if (canUseDOM) {
        Object.defineProperty(window, 'initNikeShop', {
            value: init
        });
    }
}
