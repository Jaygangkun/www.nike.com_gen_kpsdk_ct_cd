/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */

const isNonNullObject = (value: any): boolean =>
  Boolean(value) && typeof value === 'object';

const isSpecial = (value: any): boolean => {
  const stringValue = Object.prototype.toString.call(value);

  return stringValue === '[object RegExp]' || stringValue === '[object Date]';
};

const isMergeableObject = (value: any): boolean =>
  isNonNullObject(value) && !isSpecial(value);

const emptyTarget = (value: any): [] | {} => (Array.isArray(value) ? [] : {});

// eslint-disable-next-line no-confusing-arrow, @typescript-eslint/promise-function-async
const cloneUnlessOtherwiseSpecified = (value: any): any =>
  isMergeableObject(value) ? deepmerge(emptyTarget(value), value) : value;

// eslint-disable-next-line @typescript-eslint/promise-function-async
const defaultArrayMerge = (target: any, source: any): any =>
  target.concat(source).map(cloneUnlessOtherwiseSpecified);

// eslint-disable-next-line @typescript-eslint/promise-function-async
const mergeObject = (target: any, source: any): any => {
  const destination: any = {};
  if (isMergeableObject(target)) {
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    Object.keys(target).forEach((key: any): any => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key]);
    });
  }

  Object.keys(source).forEach((key: any): void => {
    destination[key] =
      !isMergeableObject(source[key]) || !target[key]
        ? cloneUnlessOtherwiseSpecified(source[key])
        : (destination[key] = deepmerge(target[key], source[key]));
  });

  return destination;
};

// eslint-disable-next-line func-style, @typescript-eslint/promise-function-async
function deepmerge(target: any, source: any): any {
  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source);
  } else if (sourceIsArray) {
    return defaultArrayMerge(target, source);
  }

  return mergeObject(target, source);
}

const merge = <T>(...array: Array<Partial<T>>): T =>
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  array.reduce<T>(deepmerge, <T>{});

export { merge };
