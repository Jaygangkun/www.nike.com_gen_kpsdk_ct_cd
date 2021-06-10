import { Cache, CacheSelector } from '../cache';
import { RawEvent } from './analytics-event.d';

type Library = {
  name: string;
  version: string;
};

type Page = {
  path: string;
  referrer: string;
  search: string;
  title: string;
  url: string;
};

type Context = {
  campaign: JSONObject;
  direct: true;
  library: Library;
  page: Page;
  userAgent: string;
};

const getContext = (_rawEvent: RawEvent, cache: Cache): Context => {
  // campaign is required by Segment (analytics.js) for an unknown reason
  const campaign = {};
  // direct is required by Segment (analytics.js) to record a user's IP Address
  const direct = true;
  const path = cache.get(CacheSelector.GLOBAL_PATH) as string;
  const referrer = cache.get(CacheSelector.GLOBAL_REFERRER) as string;
  const search = cache.get(CacheSelector.GLOBAL_SEARCH) as string;
  const title = cache.get(CacheSelector.GLOBAL_TITLE) as string;
  const url = cache.get(CacheSelector.GLOBAL_URL) as string;
  const userAgent = cache.get(CacheSelector.GLOBAL_USER_AGENT) as string;
  const libraryName = cache.get(CacheSelector.LIBRARY_NAME) as string;
  const libraryVersion = cache.get(CacheSelector.LIBRARY_VERSION) as string;

  const library = {
    name: libraryName,
    version: libraryVersion
  };

  const page = {
    path,
    referrer,
    search,
    title,
    url
  };

  return {
    campaign,
    direct,
    library,
    page,
    userAgent
  };
};

export { getContext };
