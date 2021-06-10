import { AnalyticsCallback, extractPageArgs } from './common';
import {
  AnalyticsEvent,
  RawEvent,
  makeAnalyticsEvent
} from '../analytics-event';
import { CacheSelector, cache, isDryRunMode } from '../cache';
import { initialize, ready } from '../initialize';
import { generateMessageId } from '../message-id';
import { logger } from '../logger';
import { metrics } from '../metrics';
import { send } from '../send';
import { setDebugMode } from '../debug';

const isImpressionEvent = (eventName: string): boolean => {
  const impressionEventNames = ['Product Shown', 'Impression Tracked'];
  if (impressionEventNames.indexOf(eventName) > -1) {
    return true;
  }

  return false;
};

const handleCallback = (
  payload: AnalyticsEvent,
  cb?: AnalyticsCallback
): void => {
  const timeout = cache.get(CacheSelector.TIMEOUT) as number;
  if (!cb) {
    return;
  }
  logger.warn(
    'DEPRECATION WARNING: support for callbacks will be removed in the future.'
  );
  if (isDryRunMode()) {
    cb(payload);

    return;
  }

  setTimeout((): void => {
    cb();
  }, timeout);
};

const debug = (namespace?: string | false): void => {
  if (typeof namespace === 'boolean' && Boolean(namespace)) {
    setDebugMode('', '');
  } else {
    setDebugMode(namespace);
  }
};

/* eslint-disable-next-line complexity */
const load = (writeKey?: string | JSONObject, options?: JSONObject): void => {
  try {
    if (writeKey !== undefined && typeof writeKey === 'object') {
      // eslint-disable-next-line no-param-reassign
      options = writeKey;
      // eslint-disable-next-line no-param-reassign
      writeKey = undefined;
    }
    if (cache.get(CacheSelector.LOADED) === true) {
      metrics.loadedMoreThanOnce.inc();
      if (typeof writeKey === 'string' && !cache.get(CacheSelector.WRITE_KEY)) {
        logger.warn(
          'DEPRECATION WARNING: pass write key into each event, not the load function.'
        );
        cache.set(CacheSelector.WRITE_KEY, writeKey);
      }

      return;
    }
    cache.set(CacheSelector.LOADED, true);
    metrics.loaded.inc();
    if (typeof writeKey === 'string') {
      logger.warn(
        'DEPRECATION WARNING: pass write key into each event, not the load function.'
      );
      cache.set(CacheSelector.WRITE_KEY, writeKey);
    }
    if (options && typeof options.enableDryRun === 'boolean') {
      cache.set(CacheSelector.DRY_RUN_MODE_ENABLED, options.enableDryRun);
    }
    if (options && typeof options.allowsMarketing === 'boolean') {
      cache.set(CacheSelector.PRIVACY_ALLOW_MARKETING, options.allowsMarketing);
    }
    if (options && typeof options.allowsPerformance === 'boolean') {
      cache.set(
        CacheSelector.PRIVACY_ALLOW_PERFORMANCE,
        options.allowsPerformance
      );
    }
    if (options && typeof options.countryCode === 'string') {
      cache.set(CacheSelector.COUNTRY_CODE, options.countryCode.toUpperCase());
    }
    const uniteTimeout =
      options && typeof options.uniteTimeout === 'number'
        ? options.uniteTimeout
        : undefined;
    initialize(uniteTimeout);
    if (cache.get(CacheSelector.UPM_ID) === 'unite timeout') {
      logger.warn('unite timeout on load');
    }
  } catch (err) {
    const message =
      err instanceof Error && err.message ? err.message : 'unknown error';
    const stack = err instanceof Error && err.stack ? err.stack : '';
    logger.error(err);
    metrics.loadingFailed.inc(`${message}${stack}`);
  }
};

const track = (
  eventName: unknown,
  properties: unknown,
  options: unknown,
  callback?: AnalyticsCallback
): void => {
  try {
    if (typeof eventName !== 'string') {
      throw new Error('eventName must be a string');
    }
    const messageId = generateMessageId();
    const rawEvent: RawEvent = {
      messageId,
      name: eventName,
      options: (typeof options === 'object' ? options : {}) as JSONObject,
      properties: (typeof properties === 'object'
        ? properties
        : {}) as JSONObject,
      timestamp: new Date().toISOString(),
      type: 'track'
    };
    ready((): void => {
      // make event
      const [analyticsEvent, drop] = makeAnalyticsEvent(rawEvent);
      const mustUseFetch = isImpressionEvent(eventName);
      handleCallback(analyticsEvent, callback);
      if (!isDryRunMode() && !drop) {
        send(analyticsEvent, mustUseFetch);
        if (analyticsEvent.properties.consumer.upmId === 'unite timeout') {
          logger.warn('unite timeout on track');
        }
      }
      if (!isDryRunMode() && drop) {
        logger.debug(`Event Dropped. Reason: ${drop.reason}`);
      }
    });
  } catch (err) {
    logger.error(err);
  }
};

const page = (
  pageNameOrCategory: unknown,
  propertiesOrPageName: unknown,
  optionsOrProperties: unknown,
  callbackOrOptions?: AnalyticsCallback | unknown,
  justCallback?: (payload?: AnalyticsEvent) => void
): void => {
  try {
    const {
      category,
      pageName,
      properties,
      options,
      callback
    } = extractPageArgs(
      pageNameOrCategory,
      propertiesOrPageName,
      optionsOrProperties,
      callbackOrOptions,
      justCallback
    );

    if (typeof pageName !== 'string') {
      throw new Error('pageName must be a string');
    }
    const messageId = generateMessageId();
    const rawEvent: RawEvent = {
      category,
      messageId,
      name: pageName,
      options: (typeof options === 'object' ? options : {}) as JSONObject,
      properties: (typeof properties === 'object'
        ? properties
        : {}) as JSONObject,
      timestamp: new Date().toISOString(),
      type: 'page'
    };
    const eventName: string =
      typeof rawEvent.properties.eventName === 'string'
        ? rawEvent.properties.eventName
        : pageName;
    ready((): void => {
      // make event
      const [analyticsEvent, drop] = makeAnalyticsEvent(rawEvent);
      const mustUseFetch = isImpressionEvent(eventName);
      handleCallback(analyticsEvent, callback);
      if (!isDryRunMode() && !drop) {
        send(analyticsEvent, mustUseFetch);
        if (analyticsEvent.properties.consumer.upmId === 'unite timeout') {
          logger.warn('unite timeout on page');
        }
      }
      if (!isDryRunMode() && drop) {
        logger.debug(`Event Dropped. Reason: ${drop.reason}`);
      }
    });
  } catch (err) {
    logger.error(err);
  }
};

const timeout = (ms: unknown): void => {
  logger.warn(
    'DEPRECATION WARNING: support for timeout will be removed in the future.'
  );
  if (typeof ms === 'number') {
    cache.set(CacheSelector.TIMEOUT, ms);
  }
};

const anonymousId = (value?: unknown): string => {
  if (value && typeof value === 'string') {
    cache.set(CacheSelector.ANONYMOUS_ID, value);
    logger.debug(`Anonymous ID Set: "${value}"`);
  } else {
    logger.debug('Getting Anonymous ID');
  }

  return cache.get(CacheSelector.ANONYMOUS_ID) as string;
};

export { anonymousId, debug, load, page, timeout, track };
