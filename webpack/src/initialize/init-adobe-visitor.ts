import { Cache, CacheSelector } from '../cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
declare var require: any;

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const adobeVisitorApi: () => void = require('../lib/adobe-mcid');

type AdobeValues = {
  MCAID?: string;
  MCMID: string;
};

const ADOBE_ORG_ID = 'F0935E09512D2C270A490D4D@AdobeOrg';

const visitor = ((): AdobeVisitorAPI.Visitor => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(<any>window).Visitor) {
    adobeVisitorApi();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (<any>window).Visitor.getInstance(ADOBE_ORG_ID, {
    disableIdSyncs: true,
    disableThirdPartyCalls: true,
    disableThirdPartyCookies: true,
    marketingCloudServer: 'modus.nike.com',
    marketingCloudServerSecure: 'smodus.nike.com',
    trackingServer: 'modus.nike.com',
    trackingServerSecure: 'smodus.nike.com'
  });
})();

// eslint-disable-next-line @typescript-eslint/promise-function-async
const initAdobeVisitor = (cache: Cache): Promise<void> =>
  new Promise((resolve): void => {
    // https://docs.adobe.com/content/help/en/id-service/using/id-service-api/methods/getvisitorvalues.html#getvisitorvalues_reference-b8c9e17c170c4291829a792df46ce279
    visitor.getVisitorValues(({ MCAID, MCMID }: AdobeValues): void => {
      if (MCMID) {
        cache.set(CacheSelector.ADOBE_MARKETING_CLOUD_ID, MCMID);
      }

      if (MCAID) {
        cache.set(CacheSelector.ADOBE_ANALYTICS_ID, MCAID);
      }

      resolve();
    });
  });

export { initAdobeVisitor };
