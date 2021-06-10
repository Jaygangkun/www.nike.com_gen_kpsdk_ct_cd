import { Cache, CacheSelector } from '../cache';
import { CommonProperties, Properties, RawEvent } from './analytics-event.d';
import { Cookies } from '../lib/cookie';
import { getCP } from './cp';
import { getConsumer } from './consumer';
import { getContent } from './content';
import { getPreviousView } from './previous-view';

const getProperties = (
  rawEvent: RawEvent,
  cache: Cache,
  cookies: Cookies
): Properties => {
  const { name, type: eventType } = rawEvent;
  const language = cache.get(CacheSelector.GLOBAL_BROWSER_LANGUAGE) as string;
  const classification = 'experience event';
  const consumer = getConsumer(rawEvent, cache);
  const content = getContent(rawEvent);
  const { cpCode, cpCodeReferrer } = getCP(cache);
  const eventName = eventType === 'page' ? 'Page Viewed' : name;
  const previousView = getPreviousView(rawEvent, cache, cookies);

  const wrapper = {
    build: PRODUCTION ? 'production' : 'development',
    version: VERSION
  };

  const commonProperties: CommonProperties = {
    classification,
    consumer,
    content,
    cpCode,
    cpCodeReferrer,
    eventName,
    eventType,
    language,
    previousView,
    wrapper
  };

  if (rawEvent.type === 'page') {
    const path = cache.get(CacheSelector.GLOBAL_PATH) as string;
    const referrer = cache.get(CacheSelector.GLOBAL_REFERRER) as string;
    const title = cache.get(CacheSelector.GLOBAL_TITLE) as string;
    const url = cache.get(CacheSelector.GLOBAL_URL) as string;

    return {
      ...commonProperties,
      name,
      path,
      referrer,
      title,
      url
    };
  }

  return {
    ...commonProperties
  };
};

export { getProperties };
