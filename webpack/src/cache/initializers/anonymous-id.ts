import { Cookies } from '../../lib/cookie';
import { Md5 } from '../../lib/md5';
import { getDomain } from './domain';
import { logger } from '../../logger';

const YEARS_TO_LIVE = 2;
const DOMAIN = getDomain();

const createTTLDate = (years: number): Date => {
  const ttl = new Date();

  return new Date(ttl.setFullYear(ttl.getFullYear() + years));
};

const isAnonymousId = (value: JSONValue | string | undefined): boolean =>
  typeof value === 'string' && value !== '';

const generateAnonymousId = (): string => {
  const randomString = Math.random().toString();

  const anonymousId = Md5.hashStr(new Date().toISOString() + randomString);

  if (!anonymousId) {
    throw new Error('Could not generate anonymousId');
  }

  return `DSWX${anonymousId.toString().toUpperCase()}`;
};

const getAnonymousId = (cookies: Cookies): (() => string) => (): string => {
  let anonymousIdValue = cookies.get('anonymousId');

  if (!anonymousIdValue || !isAnonymousId(anonymousIdValue)) {
    anonymousIdValue = generateAnonymousId();
  }

  ((anonymousId: string): void => {
    cookies.set('anonymousId', anonymousId.toString(), {
      domain: DOMAIN,
      expires: createTTLDate(YEARS_TO_LIVE)
    });
  })(anonymousIdValue);

  logger.debug('Anonymous Id:', anonymousIdValue);

  return anonymousIdValue;
};

export { getAnonymousId };
