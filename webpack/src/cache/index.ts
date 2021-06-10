import { Cache } from './cache.d';
import { CacheSelector } from './cache-selector';
import { cache } from './cache';
import { setupInitializers } from './initializers';
export * from './cache-helpers';

setupInitializers(cache);

export { Cache, CacheSelector, cache };
