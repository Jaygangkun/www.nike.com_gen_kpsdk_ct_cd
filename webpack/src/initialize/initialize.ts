import { addToQueue, drainQueue } from './queue';
import { cache } from '../cache';
import { initAdobeVisitor } from './init-adobe-visitor';
import { initPrivacy } from './init-privacy';
import { initUnite } from './init-unite';

let isReady = false;

const defaultUniteTimeout = 5000;
const initialize = async (
  uniteTimeout: number = defaultUniteTimeout
): Promise<void> => {
  // do privacy first
  await initPrivacy(cache);

  // do asynchronous operations
  await initAdobeVisitor(cache);
  await initUnite(cache, uniteTimeout);

  // after asynchronous operations complete
  isReady = true;
  drainQueue();
};

const ready = (cb: () => void): void => {
  if (isReady) {
    cb();

    return;
  }

  addToQueue(cb);
};

const reset = (): void => {
  isReady = false;
};

export { initialize, ready, reset };
