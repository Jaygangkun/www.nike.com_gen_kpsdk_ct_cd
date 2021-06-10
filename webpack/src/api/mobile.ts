import {
    AnalyticsCallback,
    DataCaptureAnalyticsClient,
    extractPageArgs
  } from './common';
  
  export interface AndroidNativeAnalyticsClient {
    track(jsonRaw: string): void;
    page(jsonRaw: string): void;
  }
  
  export interface IOSNativeAnalyticsClient {
    analyticsTrackHandler: {
      postMessage: (args: { eventName: unknown; properties: unknown }) => void;
    };
    analyticsPageHandler: {
      postMessage: (args: {
        category: string | null;
        pageName: unknown;
        properties: unknown;
      }) => void;
    };
  }
  
  declare global {
    /* eslint-disable lines-around-comment */
    interface Window {
      /**
       * Flag set by native apps used for determining which API implementation to use.
       *
       * This property will only be present on pages have been included from a Nike mobile app via a specially-configured WebView.
       */
      MOBILE_TARGET_PLATFORM?: 'ios' | 'android';
      /* eslint-enable lines-around-comment */
  
      /**
       * Interface present on the window when MOBILE_TARGET_PLATFORM is set to 'android'.
       *
       * Data sent through these methods is deserialized and processed through Nike's native Android analytics capabilities.
       */
      AndroidAnalyticsClient: AndroidNativeAnalyticsClient;
  
      /**
       * Interface present on the window when MOBILE_TARGET_PLATFORM is set to 'ios'.
       */
      webkit: {
        messageHandlers: IOSNativeAnalyticsClient;
      };
    }
  }
  
  const mobileImplementationBase = {
    debug(): void {
      // NoOp in mobile
    },
    load(): void {
      // NoOp in mobile
    },
    timeout(): void {
      // NoOp in mobile
    }
  };
  
  /**
   * Executes a function and silently fails while logging an additional message.
   *
   * The extra message makes it easier to search for errors in mobile debugging tools.
   */
  const safeExecute = (
    action: (...args: unknown[]) => unknown,
    callback?: AnalyticsCallback
  ): void => {
    try {
      action();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('An error occured when trying to use the mobile bridge!', err);
    } finally {
      if (callback) {
        // eslint-disable-next-line callback-return
        callback();
      }
    }
  };
  
  /** Android-specific implementation of analytics client API */
  export const AndroidImplementation: DataCaptureAnalyticsClient = {
    ...mobileImplementationBase,
    page(...args): void {
      const { category, pageName, properties, callback } = extractPageArgs(
        ...args
      );
      safeExecute(
        (): void =>
          window.AndroidAnalyticsClient.page(
            JSON.stringify({ category, pageName, properties })
          ),
        callback
      );
    },
    track(
      eventName: unknown,
      properties: unknown,
      _options: unknown,
      callback?: AnalyticsCallback
    ): void {
      safeExecute(
        (): void =>
          window.AndroidAnalyticsClient.track(
            JSON.stringify({ eventName, properties })
          ),
        callback
      );
    }
  };
  
  /** iOS-specific implementation of analytics client API */
  export const IOSImplementation: DataCaptureAnalyticsClient = {
    ...mobileImplementationBase,
    page(...args): void {
      const { category, pageName, properties, callback } = extractPageArgs(
        ...args
      );
      safeExecute(
        (): void =>
          window.webkit.messageHandlers.analyticsPageHandler.postMessage({
            category,
            pageName,
            properties
          }),
        callback
      );
    },
    track(
      eventName: unknown,
      properties: unknown,
      _options: unknown,
      callback?: AnalyticsCallback
    ): void {
      safeExecute(
        (): void =>
          window.webkit.messageHandlers.analyticsTrackHandler.postMessage({
            eventName,
            properties
          }),
        callback
      );
    }
  };
  