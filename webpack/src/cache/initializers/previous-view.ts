import { Cookies } from '../../lib/cookie';

const COOKIE_NAME = 'ppd';

const defaultPageName = 'entry>entry';
const defaultPageType = 'entry';

type PreviousView = {
  pageName: string;
  pageType: string;
};

const decodeCookieValue = (cookieValue: string): PreviousView => {
  const [pageType, pageName] = cookieValue.split('|');

  return {
    pageName,
    pageType
  };
};

const getPpdValue = (cookies: Cookies): PreviousView => {
  const ppd =
    cookies.get(COOKIE_NAME) || `${defaultPageType}|${defaultPageName}`;

  return decodeCookieValue(ppd);
};

const getPreviousViewPageName = (
  cookies: Cookies
): (() => string | undefined) => (): string | undefined => {
  const { pageName } = getPpdValue(cookies);

  return pageName;
};

const getPreviousViewPageType = (
  cookies: Cookies
): (() => string | undefined) => (): string | undefined => {
  const { pageType } = getPpdValue(cookies);

  return pageType;
};

export { getPreviousViewPageName, getPreviousViewPageType };
