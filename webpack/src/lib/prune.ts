/* eslint-disable @typescript-eslint/no-empty-interface */

interface JSArray extends Array<JSValue> {}

interface JSObject {
  [key: string]: JSValue;
}

type JSValue =
  | boolean
  | JSArray
  | JSObject
  | null
  | number
  | object
  | string
  | undefined;

const isEmptyString = (value: JSValue): JSValue => value === '';
const isUndefined = (value: JSValue): JSValue => typeof value === 'undefined';
const isPlainObject = (value: JSValue): boolean =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isNil = (value: JSValue): boolean =>
  value === undefined || value === null;

const prune = (value: JSValue): JSValue => {
  if (Array.isArray(value)) {
    const prunedArray: JSArray = value
      .map(prune)
      .filter((prunedElement): boolean => !isUndefined(prunedElement));

    return prunedArray.length > 0 ? prunedArray : undefined;
  }

  if (isPlainObject(value)) {
    const prunedObject: JSObject = Object.keys(<JSObject>value).reduce<
      JSObject
    >((newObject: JSObject, propertyKey: string): JSObject => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prunedPropertyValue = prune((<any>value)[propertyKey]);
      if (!isUndefined(prunedPropertyValue)) {
        newObject[propertyKey] = prunedPropertyValue;
      }

      return newObject;
    }, {});

    return Object.keys(prunedObject).length > 0 ? prunedObject : undefined;
  }

  if (isNil(value) || isEmptyString(value)) {
    return undefined;
  }

  return value;
};

export { prune };
