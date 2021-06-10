import { Cache, CacheSelector } from '../cache';
import { CP } from './analytics-event.d';

const getCP = (cache: Cache): CP => {
  const cp: CP = {};
  const search = cache.get(CacheSelector.GLOBAL_SEARCH) as string | undefined;
  const referrer = cache.get(CacheSelector.GLOBAL_REFERRER) as
    | string
    | undefined;
  const matcher = /cp=([^&#]*)/;
  if (search !== undefined) {
    const cpCodes = search.match(matcher);
    if (cpCodes !== null) {
      [, cp.cpCode] = cpCodes;
    }
  }
  if (referrer !== undefined) {
    const cpCodeReferrers = referrer.match(matcher);
    if (cpCodeReferrers !== null) {
      [, cp.cpCodeReferrer] = cpCodeReferrers;
    }
  }

  return cp;
};

export { getCP };
