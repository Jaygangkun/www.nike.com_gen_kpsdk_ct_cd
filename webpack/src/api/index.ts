import * as WebImplementation from './web';
import { AndroidImplementation, IOSImplementation } from './mobile';
import { DataCaptureAnalyticsClient } from './common';

export const makeAPI = (
  targetPlatform?: string
): DataCaptureAnalyticsClient => {
  switch (targetPlatform) {
    case 'ios':
      // Implementation forwarding analytics to Nike iOS apps for certain pages in eShopWorld and nike.com.
      return IOSImplementation;
    case 'android':
      // Implementation forwarding analytics to Nike Android apps for certain pages in eShopWorld and nike.com.
      return AndroidImplementation;
    default:
      // The established API 99.9% of clients will use
      return WebImplementation;
  }
};
