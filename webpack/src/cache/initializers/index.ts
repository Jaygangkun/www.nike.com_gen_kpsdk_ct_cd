import { getLibraryName, getLibraryVersion } from './library';
import {
  getPreviousViewPageName,
  getPreviousViewPageType
} from './previous-view';
import { Cache } from '../cache.d';
import { CacheSelector } from '../cache-selector';
import { Cookies } from '../../lib/cookie';
import { getAnonymousId } from './anonymous-id';
import { getBrowserLanguage } from './browser-language';
import { getDebugMode } from './debug';
import { getDomain } from './domain';
import { getPath } from './path';
import { getReferrer } from './referrer';
import { getSearch } from './search';
import { getTimeout } from './timeout';
import { getTitle } from './title';
import { getUrl } from './url';
import { getUserAgent } from './user-agent';
const cookies = new Cookies();

const setupInitializers = (cache: Cache): void => {
  cache.addInitializer(CacheSelector.ANONYMOUS_ID, getAnonymousId(cookies));
  cache.addInitializer(
    CacheSelector.GLOBAL_BROWSER_LANGUAGE,
    getBrowserLanguage
  );
  cache.addInitializer(CacheSelector.GLOBAL_DOMAIN, getDomain);
  cache.addInitializer(CacheSelector.GLOBAL_PATH, getPath);
  cache.addInitializer(CacheSelector.GLOBAL_REFERRER, getReferrer);
  cache.addInitializer(CacheSelector.GLOBAL_SEARCH, getSearch);
  cache.addInitializer(CacheSelector.GLOBAL_TITLE, getTitle);
  cache.addInitializer(CacheSelector.GLOBAL_URL, getUrl);
  cache.addInitializer(CacheSelector.GLOBAL_USER_AGENT, getUserAgent);
  cache.addInitializer(CacheSelector.TIMEOUT, getTimeout);
  cache.addInitializer(
    CacheSelector.PREVIOUS_VIEW_PAGE_NAME,
    getPreviousViewPageName(cookies)
  );
  cache.addInitializer(
    CacheSelector.PREVIOUS_VIEW_PAGE_TYPE,
    getPreviousViewPageType(cookies)
  );
  cache.addInitializer(CacheSelector.LIBRARY_NAME, getLibraryName);
  cache.addInitializer(CacheSelector.LIBRARY_VERSION, getLibraryVersion);
  cache.addInitializer(CacheSelector.DEBUG_MODE_ENABLED, getDebugMode);
};

export { setupInitializers };
