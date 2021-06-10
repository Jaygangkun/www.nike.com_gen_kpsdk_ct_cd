import { isDebugMode, isDryRunMode } from './cache';

type InsightsRequestData = {
  [key: string]: string | number;
};

type InsightsRequestOptions = {
  body: string;
  headers: {
    'Content-Type': 'application/json';
    'X-Insert-Key': string;
  };
  json: true;
  method: 'POST';
};

const PROD_CONFIG = {
  accountId: '714737',
  insertKey: 'TlcCcdatOd3c4G2tuEcPqQ8mB88ge2X2'
};

const TEST_CONFIG = {
  accountId: '714739',
  insertKey: 'Gz-Rg5eUwnqvGEGOg91lByjrj4i2f_Qn'
};

const isDebugEnabled = (): boolean => !PRODUCTION || isDebugMode();

const getUri = (): string => {
  const accountId = isDebugEnabled()
    ? TEST_CONFIG.accountId
    : PROD_CONFIG.accountId;

  return `https://insights-collector.newrelic.com/v1/accounts/${accountId}/events`;
};

const getInsertKey = (): string => {
  const insertKey = isDebugEnabled()
    ? TEST_CONFIG.insertKey
    : PROD_CONFIG.insertKey;

  return insertKey;
};

const configureOptions = (
  insertKey: string,
  data: InsightsRequestData
): InsightsRequestOptions => ({
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'X-Insert-Key': insertKey
  },
  json: true,
  method: 'POST'
});

// eslint-disable-next-line @typescript-eslint/promise-function-async
const sendRequest = (
  uri: string,
  options: InsightsRequestOptions
): Promise<Response> | undefined => fetch(uri, options);

const prepareData = (data: object): object => ({
  ...data,
  environment: PRODUCTION ? 'production' : 'development',
  // eslint-disable-next-line
  filename: __webpack_chunkname__,
  hostname: window.location.hostname,
  href: window.location.href,
  referrer: document.referrer,
  userAgent: window.navigator.userAgent,
  version: VERSION
});

// Suppress newrelic metrics to avoid overages in newrelic logging.
const suppressInsights = ((): ((n: string) => boolean) => {
  const countDown: { [n: string]: number } = {};
  const decrement = (n: string): void => {
    if (Object.prototype.hasOwnProperty.call(countDown, n)) {
      countDown[n] -= 1;
    } else {
      countDown[n] = 10;
    }
  };

  return (n: string): boolean => {
    if (countDown[n] <= 0) {
      return true;
    }

    decrement(n);

    return false;
  };
})();

const sendInsights = (name: string, message?: string): void => {
  if (suppressInsights(name) || isDryRunMode()) {
    return;
  }

  sendRequest(
    getUri(),
    configureOptions(getInsertKey(), {
      ...prepareData({ message, name }),
      eventType: 'DataCaptureEvent'
    })
  );
};

export { sendInsights };
