/* eslint-disable no-mixed-operators */
/* eslint-disable @typescript-eslint/no-empty-interface, prefer-destructuring */

// JavaScript Cookie v2.2.0-modifed
// https://github.com/js-cookie/js-cookie
//
// Copyright 2006, 2015 Klaus Hartl & Fagner Brack
// Released under the MIT license

// Modified by Douglas Jenkins 2018-10 to add types
// Modified by Douglas Jenkins 2018-10 to check for fully quoted values

// 1000 * 60 * 60 * 24;
const MS_IN_A_DAY = 86400000;

type JSONValue = boolean | JSONArray | JSONObject | number | string;

interface JSONObject {
  [index: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

interface ConverterObject {
  read?(cookieValue: string, cookieName: string): string;
  write?(value: string, key: string): string;
}

type ConverterFunction = (value: string, name?: string) => string;

const isConverterObject = (
  converter: ConverterFunction | ConverterObject
): converter is ConverterObject => typeof converter !== 'function';

export interface CookieAttributes {
  domain?: string;
  expires?: number | Date;
  path?: string;
  secure?: boolean;
  [index: string]: boolean | Date | number | string | undefined;
}

const stringifyAttribute = (
  attribute: string,
  value?: boolean | Date | number | string
): string => {
  // Considers RFC 6265 section 5.2:
  // 3.  If the remaining unparsed-attributes contains a %x3B (";") character:
  // Consume the characters of the unparsed-attributes up to, not including,
  // the first %x3B (";") character.

  const stringifiedValue = `${value}`.split(';')[0];

  if (!stringifiedValue) {
    return '';
  }

  return `${attribute}=${stringifiedValue}`;
};

const stringifyExpires = (value: number | Date): string => {
  const expirationDate =
    typeof value === 'number'
      ? new Date(new Date().getTime() + value * MS_IN_A_DAY)
      : value;

  return `expires=${expirationDate.toUTCString()}`;
};

const stringifySecure = (value: boolean): string => (value ? 'secure' : '');

const decode = (s: string): string =>
  s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);

const stringifyAttributes = (attributes: CookieAttributes): string => {
  const attributeStrings: string[] = [];

  Object.keys(attributes).forEach((attributeName): void => {
    if (!attributes[attributeName]) {
      return;
    }

    if (attributeName === 'expires') {
      if (!attributes.expires) {
        return;
      }
      attributeStrings.push(stringifyExpires(attributes.expires));
    } else if (attributeName === 'secure') {
      if (!(typeof attributes.secure === 'boolean')) {
        return;
      }
      attributeStrings.push(stringifySecure(attributes.secure));
    } else {
      attributeStrings.push(
        stringifyAttribute(attributeName, attributes[attributeName])
      );
    }
  });

  return attributeStrings.length ? `; ${attributeStrings.join('; ')}` : '';
};

export class Cookies {
  public defaults: CookieAttributes;

  public logger: Console;

  private readonly converter: ConverterFunction | ConverterObject;

  public constructor(
    converter?: ConverterFunction | ConverterObject,
    logger?: Console
  ) {
    this.converter = converter || decode;
    this.defaults = {};
    this.logger = logger || console;
  }

  public static withConverter(
    converter: ConverterObject | ConverterFunction
  ): Cookies {
    return new Cookies(converter);
  }

  public get(): object;

  public get(key: string): string;

  public get(key: string, json: true): object;

  public get(key?: string, json?: boolean): object | string {
    const jar: {
      [index: string]: JSONObject | string;
    } = {};
    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    cookies.forEach((cookie): void => {
      const parts = cookie.split('=');

      let cookieValue: JSONObject | string = parts.slice(1).join('=');

      if (
        !json &&
        cookieValue.charAt(0) === '"' &&
        cookieValue.charAt(cookieValue.length - 1) === '"'
      ) {
        cookieValue = cookieValue.slice(1, -1);
      }

      try {
        const cookieName = decode(parts[0]);

        cookieValue = isConverterObject(this.converter)
          ? (cookieValue =
              (this.converter.read &&
                this.converter.read(cookieValue, cookieName)) ||
              decode(cookieValue))
          : (cookieValue = this.converter(cookieValue, cookieName));

        if (json) {
          try {
            cookieValue = <JSONObject>JSON.parse(cookieValue);
          } catch (err) {
            // Do nothing on failure
          }
        }

        cookieValue = cookieValue || jar[cookieName] || '';

        jar[cookieName] = cookieValue;
      } catch (err) {
        // Ignore errors from cookies with invalid names
        // or ignore that user defined converter has failed
      }
    });

    return key ? jar[key] : jar;
  }

  public getJSON(key?: string): object {
    if (!key) {
      return this.get('', true);
    }

    return this.get(key, true);
  }

  public remove(key: string, attributes?: object): void {
    // We're using "expires" because "max-age" is not supported by IE
    this.set(key, '', {
      ...attributes,
      expires: -1
    });
  }

  public set(
    key: string,
    value: boolean | number | object | string,
    attributes: CookieAttributes = {}
  ): string {
    const composedAttributes = {
      path: '/',
      ...this.defaults,
      ...attributes
    };

    let stringifiedValue = `${value}`;

    // Automagically parse objects into strings
    if (typeof value === 'object' && !(value instanceof String)) {
      try {
        const result = JSON.stringify(value);
        if (/^[{[]/.test(result)) {
          stringifiedValue = result;
        }
      } catch (err) {
        this.logger.error(err);
        stringifiedValue = value.toString();
      }
    }

    // Use a custom converter if specified,
    // or write the cookie with URI decoded values
    if (isConverterObject(this.converter) && this.converter.write) {
      stringifiedValue = this.converter.write(stringifiedValue, key);
    } else {
      stringifiedValue = encodeURIComponent(stringifiedValue).replace(
        /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
        decodeURIComponent
      );
    }

    const encodedKey = encodeURIComponent(key)
      .replace(/%(?:23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    return (document.cookie = `${encodedKey}=${stringifiedValue}${stringifyAttributes(
      composedAttributes
    )}`);
  }
}
