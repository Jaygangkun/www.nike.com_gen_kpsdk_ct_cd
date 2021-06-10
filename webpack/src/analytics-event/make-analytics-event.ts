import { AnalyticsEvent, Properties, RawEvent } from './analytics-event';
import { Cookies } from '../lib/cookie';
import { cache } from '../cache';
import { getBaseProperties } from './base';
import { getContext } from './context';
import { getProperties } from './properties';
import { merge } from '../lib/merge';
import { prune } from '../lib/prune';

type DropReason = string;
type Drop = {
  reason: DropReason;
};

const cookies = new Cookies();

const eventShouldBeDropped = (
  analyticsEvent: AnalyticsEvent
): DropReason | undefined => {
  if (!analyticsEvent) {
    return 'analytics-event-missing';
  }

  if (
    !analyticsEvent.properties.consumer.allowsMarketing ||
    !analyticsEvent.properties.consumer.allowsPerformance
  ) {
    return 'user-permission-denied';
  }

  return undefined;
};

const makeAnalyticsEvent = (
  rawEvent: RawEvent
): [AnalyticsEvent, (Drop | undefined)] => {
  const {
    category,
    messageId,
    options,
    properties,
    timestamp,
    type
  } = rawEvent;

  const analyticsEvent = {
    ...getBaseProperties(rawEvent),
    context: getContext(rawEvent, cache),
    properties: getProperties(rawEvent, cache, cookies),
    sentAt: new Date().toISOString()
  };

  const rawAnalyticsEvent = {
    ...options,
    category,
    messageId,
    properties: properties as Properties,
    timestamp,
    type
  };

  const mergedAnalyticsEvent = merge<AnalyticsEvent>(
    analyticsEvent,
    rawAnalyticsEvent
  );

  const prunedAnalyticsEvent = <AnalyticsEvent>prune(mergedAnalyticsEvent);

  const dropReason = eventShouldBeDropped(prunedAnalyticsEvent);

  return [
    prunedAnalyticsEvent,
    dropReason ? { reason: dropReason } : undefined
  ];
};

export { makeAnalyticsEvent };
