import { AnalyticsEvent } from '../analytics-event';

export type AnalyticsCallback = (payload?: AnalyticsEvent) => void;

export type DataCaptureAnalyticsClient = {
  debug(namespace?: string | false): void;
  load(
    writeKey?: string | Record<string, unknown>,
    options?: Record<string, unknown>
  ): void;
  track(
    eventName: unknown,
    properties: unknown,
    options: unknown,
    callback?: AnalyticsCallback
  ): void;
  page(
    pageNameOrCategory: unknown,
    propertiesOrPageName: unknown,
    optionsOrProperties: unknown,
    callbackOrOptions?: AnalyticsCallback | unknown,
    justCallback?: AnalyticsCallback
  ): void;
  timeout(ms: unknown): void;
};

export interface PageEventArguments {
  category: string | null;
  pageName: unknown;
  properties: unknown;
  options: unknown;
  callback?: AnalyticsCallback;
}

/**
 * Helper used to normalize the variadic parameter list for the .page() API method.
 */
export const extractPageArgs = (
  pageNameOrCategory: unknown,
  propertiesOrPageName: unknown,
  optionsOrProperties: unknown,
  callbackOrOptions?: AnalyticsCallback | unknown,
  justCallback?: (payload?: AnalyticsEvent) => void
): PageEventArguments => {
  const category =
    typeof pageNameOrCategory === 'string' &&
    typeof propertiesOrPageName === 'string'
      ? pageNameOrCategory
      : null;
  const pageName =
    typeof propertiesOrPageName === 'string'
      ? propertiesOrPageName
      : pageNameOrCategory;
  const properties =
    typeof propertiesOrPageName === 'string'
      ? optionsOrProperties
      : propertiesOrPageName;
  const options =
    typeof callbackOrOptions === 'object'
      ? callbackOrOptions
      : optionsOrProperties;
  const callback = (typeof callbackOrOptions === 'function'
    ? callbackOrOptions
    : justCallback) as AnalyticsCallback;

  return {
    callback,
    category,
    options,
    pageName,
    properties
  };
};
