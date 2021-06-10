import { BaseProperties, EventType } from './analytics-event.d';
import { CacheSelector, cache } from '../cache';

interface Base extends BaseProperties {
  category: null;
  userId: string | null;
}

/**
 * Returns base properties for an event
 */
const getBaseProperties = ({
  type: eventType,
  name
}: {
  type: EventType;
  name: string;
}): Base => {
  const anonymousId = cache.get(CacheSelector.ANONYMOUS_ID);

  if (typeof anonymousId !== 'string') {
    throw new Error(`anonymousId must be a string`);
  }

  // category as null is required to use Segment correctly
  const category = null;
  const nameKey = eventType === 'page' ? 'name' : 'event';

  const userId = cache.get(CacheSelector.UPM_ID);
  const writeKey = cache.get(CacheSelector.WRITE_KEY);

  if (typeof writeKey !== 'string' && typeof writeKey !== 'undefined') {
    throw new Error('writeKey must be a string');
  }

  return {
    anonymousId,
    category,
    [nameKey]: name,
    type: eventType,
    userId:
      typeof userId === 'string' && userId !== 'unite timeout' ? userId : null,
    writeKey
  };
};

export { getBaseProperties };
