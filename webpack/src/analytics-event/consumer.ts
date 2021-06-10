import { Cache, CacheSelector } from '../cache';
import { Consumer, LoginStatus, RawEvent } from './analytics-event.d';

const getConsumer = (_rawEvent: RawEvent, cache: Cache): Consumer => {
  const adobeVisitorId = cache.get(CacheSelector.ADOBE_ANALYTICS_ID);
  const adobeMarketingCloudId = cache.get(
    CacheSelector.ADOBE_MARKETING_CLOUD_ID
  );
  const allowsMarketing = cache.get(CacheSelector.PRIVACY_ALLOW_MARKETING);
  const allowsPerformance = cache.get(CacheSelector.PRIVACY_ALLOW_PERFORMANCE);
  const anonymousId = cache.get(CacheSelector.ANONYMOUS_ID);
  const upmId = cache.get(CacheSelector.UPM_ID);
  const userType = cache.get(CacheSelector.USER_TYPE);

  const isSwoosh = userType === 'EMPLOYEE';
  const loginStatus = ((type?: unknown): LoginStatus => {
    switch (type) {
      case 'EMPLOYEE':
        return 'logged in:swoosh';
      case 'DEFAULT_USER':
        return 'logged in';
      case 'unite timeout':
        return 'unite timeout';
      default:
        return 'not logged in';
    }
  })(userType);

  if (typeof anonymousId !== 'string') {
    throw new Error('anonymousId must be a string');
  }

  return {
    adobeMarketingCloudId:
      typeof adobeMarketingCloudId === 'string'
        ? adobeMarketingCloudId
        : undefined,
    adobeVisitorId:
      typeof adobeVisitorId === 'string' ? adobeVisitorId : undefined,
    allowsMarketing:
      typeof allowsMarketing === 'boolean' ? allowsMarketing : false,
    allowsPerformance:
      typeof allowsPerformance === 'boolean' ? allowsPerformance : false,
    anonymousId,
    isSwoosh,
    loginStatus,
    upmId: typeof upmId === 'string' ? upmId : 'guest'
  };
};

export { getConsumer };
