import getStaticData from '@nike/get-static-data';
import {addPageAction} from '@nike/ux-tread-new-relic';

// `actionName` is from newrelic syntax for PageActions
const ACTION_NAMES = {
    localeSetPreviously: 'nike-shop-locale-set-previously',
    localeSet: 'nike-shop-locale-set',
    localeFailure: 'nike-shop-locale-failure',
    localePoc: 'nike-shop-shell-client-locale-poc',
};

const trackLocale = ({actionName, country, language, webShellLocale, fallbackLocale, startTime, })=>{
    return addPageAction(actionName, {
        version: window?.NikeShop?.version,
        loadTime: Date.now() - startTime,
        requestedCountry: country,
        requestedLanguage: language,
        webShellLocaleCountry: webShellLocale?.country,
        webShellLocaleLanguage: webShellLocale?.language,
        webShellLocaleUrlFragment: webShellLocale?.cloudUrlFragment,
        fallbackCountry: fallbackLocale?.country,
        fallbackLanguage: fallbackLocale?.language,
        fallbackUrlFragment: fallbackLocale?.cloudUrlFragment,
    });
}
;
const setupLocaleData = ({country, language, startTime})=>{
    const webShellLocale = window?.webShellClient?.locale?.get();
    const fallbackLocale = window?.nikeShopShellProxy?.locale;
    const lowerCasedCountry = country?.toLowerCase();
    if (webShellLocale?.country === lowerCasedCountry) {
        // NOTE we were previously tracking this way below in the then statement but when we moved it up here we forgot(?) the tracking code
        trackLocale({
            actionName: ACTION_NAMES.localePoc,
            country,
            language,
            webShellLocale,
            fallbackLocale,
            startTime,
        });
        // NOTE we don't do anything with this returned data but it should be a promise
        // to match the returns in the other conditions.
        // Returning a non-promise may bite us later
        return Promise.resolve(webShellLocale);
    }
    // we will eventually want to instantiate locale based on window.shell.locale
    // but until then we can progress our current codebase with a proxy global that functions the same way
    const shellProxy = (typeof window !== 'undefined' && window?.nikeShopShellProxy) || {};
    const locale = shellProxy?.locale;
    Object.defineProperty(window, 'nikeShopShellProxy', {
        value: shellProxy
    });

    if (locale) {
        // NOTE we should see if this is accurate and how many times webshelllocale might exist but not match
        trackLocale({
            actionName: ACTION_NAMES.localeSetPreviously,
            country,
            language,
            webShellLocale,
            fallbackLocale: locale,
            startTime,
        });
        return Promise.resolve(locale);
    }

    return getStaticData({
        resourcePath: 'experience/pet',
        resource: 'locale-data',
        file: `${lowerCasedCountry}__${language}`,
    }).then(data=>({
        ...data,
        ready: true
    }))// NOTE I don't think we need to do the ready anymore
    .catch(()=>{
        // in case there are failures happening we should track and address (now and later with shell.locale as well)
        trackLocale({
            actionName: ACTION_NAMES.localeFailure,
            country,
            language,
            webShellLocale,
            fallbackLocale,
            startTime,
        });

        return {
            ready: true,
            country,
            language
        };
    }
    ).then(({ready, ...localeData})=>{
        // we can track how much this is actually costing us
        shellProxy.locale = localeData;
        trackLocale({
            actionName: ACTION_NAMES.localeSet,
            country,
            language,
            webShellLocale,
            fallbackLocale: localeData,
            startTime,
        });
        return {
            ready,
            ...localeData
        };
    }
    );
}
;

export default setupLocaleData;
