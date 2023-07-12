import {cookies, headers} from 'next/headers';
import {cache} from 'react';
import {getLocaleFromPathname} from '../middleware/utils';
import {COOKIE_LOCALE_NAME, HEADER_LOCALE_NAME} from '../shared/constants';

const getLocaleFromHeader = cache(() => {
  let locale;

  try {
    // A header is only set when we're changing the locale,
    // otherwise we reuse an existing one from the cookie.
    const requestHeaders = headers();
    if (requestHeaders.has(HEADER_LOCALE_NAME)) {
      locale = requestHeaders.get(HEADER_LOCALE_NAME);
    } else if (cookies().has(COOKIE_LOCALE_NAME)) {
      locale = cookies().get(COOKIE_LOCALE_NAME)?.value;
    } else {
      const invokePath = headers().get('x-invoke-path');
      if (invokePath) {
        locale = getLocaleFromPathname(invokePath);
      } else {
        locale = 'fr';
      }
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error as any).digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      throw new Error(
        'Usage of next-intl APIs in Server Components is currently only available for dynamic rendering (i.e. no `generateStaticParams`).\n\nSupport for static rendering is under consideration, please refer to the roadmap: https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components#roadmap',
        {cause: error}
      );
    } else {
      throw error;
    }
  }

  if (!locale) {
    throw new Error(
      'Unable to find `next-intl` locale, have you configured the middleware?`'
    );
  }

  return locale;
});

export default getLocaleFromHeader;
