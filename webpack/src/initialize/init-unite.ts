// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
declare var window: any;

import { Cache, CacheSelector } from '../cache';

interface Entity {
  id: string;
  type?: string;
}

interface UserProfile {
  upmId?: string;
  entity?: Entity;
  statusOverview?: object;
}

interface Session {
  getUserProfile(
    successHandler: (userProfile: UserProfile, userType?: string) => void,
    errorHandler: (errorResult: Error, errorCode: number) => void
  ): void;
}

interface Handlers<T> {
  addHandler: (fn: (data: T) => void) => void;
}

interface LoginHandlers {
  success: Handlers<{}>;
}

interface On {
  login: LoginHandlers;
}

interface Unite {
  isInitialized: boolean;
  on: On;
  session: Session;
}

const INTERVAL_MS = 100;

// eslint-disable-next-line @typescript-eslint/promise-function-async
const getUnite = (uniteTimeout: number): Promise<Unite> =>
  new Promise<Unite>((resolve, reject): void => {
    let timer = 0;
    const interval = setInterval((): void => {
      timer += INTERVAL_MS;

      if (
        window &&
        window.nike &&
        window.nike.unite &&
        window.nike.unite.isInitialized
      ) {
        clearInterval(interval);
        resolve(window.nike.unite);
      }

      if (timer >= uniteTimeout) {
        clearInterval(interval);
        reject(new Error('timeout waiting for nike.unite'));
      }
    }, INTERVAL_MS);

    window.addEventListener('nikeUniteInit', (): void => {
      clearTimeout(interval);
      resolve(window.nike && window.nike.unite);
    });
  });

// eslint-disable-next-line @typescript-eslint/promise-function-async
const updateUniteValues = (cache: Cache, unite: Unite): Promise<void> =>
  new Promise((resolve, reject): void => {
    const onError = (errorResult: Error, errorCode: number): void => {
      const { message = 'Unknown Error' } = errorResult;
      reject(
        new Error(
          `Unite service attempt to retrieve upmId responded with error code ${errorCode} and "${message}"`
        )
      );
    };

    const onSuccess = (userProfile: UserProfile, userType?: string): void => {
      const upmId =
        (userProfile && userProfile.upmId) ||
        (userProfile && userProfile.entity && userProfile.entity.id);

      if (upmId) {
        cache.set(CacheSelector.UPM_ID, upmId);
      }
      if (userType) {
        cache.set(CacheSelector.USER_TYPE, userType);
      }
      resolve();
    };

    unite.session.getUserProfile(onSuccess, onError);
  });

// eslint-disable-next-line no-magic-numbers
let maxRetries = 10;

const initUnite = async (cache: Cache, uniteTimeout: number): Promise<void> => {
  try {
    const unite = await getUnite(uniteTimeout);

    unite.on.login.success.addHandler((_data): void => {
      updateUniteValues(cache, unite);
    });

    return updateUniteValues(cache, unite);
  } catch (err) {
    cache.set(CacheSelector.UPM_ID, 'unite timeout');
    cache.set(CacheSelector.USER_TYPE, 'unite timeout');
    maxRetries -= 1;

    if (maxRetries > 0) {
      // keep trying
      initUnite(cache, uniteTimeout);
    }

    return Promise.resolve();
  }
};

export { initUnite };
