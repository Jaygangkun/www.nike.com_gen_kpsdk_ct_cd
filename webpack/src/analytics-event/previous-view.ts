import { Cache, CacheSelector } from '../cache';
import { PreviousView, RawEvent } from './analytics-event.d';
import { Cookies } from '../lib/cookie';

const COOKIE_NAME = 'ppd';

const canSetPreviousView = (
  { type, properties: { view } }: RawEvent,
  cache: Cache
): boolean => {
  if (cache.get(CacheSelector.DRY_RUN_MODE_ENABLED) === true) {
    return false;
  }
  if (typeof view !== 'object' || Array.isArray(view) || view === null) {
    return false;
  }
  const pageName = view.pageName || view.name;
  const pageType = view.pageType || view.channel;

  if (type === 'page' && pageName && pageType) {
    return true;
  }

  return false;
};

const getPreviousView = (
  rawEvent: RawEvent,
  cache: Cache,
  cookies: Cookies
): PreviousView => {
  let {
    properties: { view }
  } = rawEvent;

  if (typeof view !== 'object' || Array.isArray(view) || view === null) {
    view = {};
  }

  const pageName =
    typeof view.pageName === 'string'
      ? view.pageName
      : typeof view.name === 'string'
      ? view.name
      : undefined;
  const pageType =
    typeof view.pageType === 'string'
      ? view.pageType
      : typeof view.channel === 'string'
      ? view.channel
      : undefined;
  let previousPageName = cache.get(CacheSelector.PREVIOUS_VIEW_PAGE_NAME);
  let previousPageType = cache.get(CacheSelector.PREVIOUS_VIEW_PAGE_TYPE);

  if (canSetPreviousView(rawEvent, cache)) {
    previousPageName = cache.get(CacheSelector.PREVIOUS_VIEW_PAGE_NAME, true);
    previousPageType = cache.get(CacheSelector.PREVIOUS_VIEW_PAGE_TYPE, true);
    cookies.set(COOKIE_NAME, `${pageType}|${pageName}`, {
      domain: cache.get(CacheSelector.GLOBAL_DOMAIN) as string
    });
  }

  return {
    pageName:
      typeof previousPageName === 'string' ? previousPageName : 'entry>entry',
    pageType: typeof previousPageType === 'string' ? previousPageType : 'entry'
  };
};

export { getPreviousView };
