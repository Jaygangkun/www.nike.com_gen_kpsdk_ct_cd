import {
    Cache,
    CacheValue,
    Initializer,
    Initializers,
    Values
  } from './cache.d';
  import { CacheSelector } from './cache-selector';
  
  const values: Values = {};
  const initializers: Initializers = {};
  const addInitializer = (
    selector: CacheSelector,
    initializer: Initializer
  ): void => {
    initializers[selector] = initializer;
  };
  const get = (selector: CacheSelector, fresh?: true): CacheValue => {
    if (fresh === true || (!values[selector] && initializers[selector])) {
      values[selector] = initializers[selector]();
    }
  
    return values[selector];
  };
  const set = (selector: CacheSelector, value: CacheValue): void => {
    values[selector] = value;
  };
  const reset = (): void => {
    const selectors = Object.keys(values);
  
    for (const selector of selectors) {
      if (CacheSelector[Number(selector)]) {
        delete values[Number(selector)];
      }
    }
  };
  
  const cache: Cache = {
    addInitializer,
    get,
    reset,
    set
  };
  
  export { cache };
  