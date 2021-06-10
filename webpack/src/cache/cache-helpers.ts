import { CacheSelector } from './cache-selector';
import { cache } from './cache';

const isDebugMode = (): boolean => {
  const debugModeEnabled = cache.get(CacheSelector.DEBUG_MODE_ENABLED);
  if (typeof debugModeEnabled === 'boolean') {
    return debugModeEnabled;
  }

  return false;
};

const isDryRunMode = (): boolean => {
  const dryRunModeEnabled = cache.get(CacheSelector.DRY_RUN_MODE_ENABLED);
  if (typeof dryRunModeEnabled === 'boolean') {
    return dryRunModeEnabled;
  }

  return false;
};

export { isDebugMode, isDryRunMode };
