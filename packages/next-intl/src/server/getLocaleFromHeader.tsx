import {headers} from 'next/headers';
import {cache} from 'react';
import {getLocaleFromPathname} from '../middleware/utils';

const getLocaleFromHeader = cache(() => {
  const invokePath = headers().get('x-invoke-path');
  if (!invokePath) {
    return 'fr';
  }
  return getLocaleFromPathname(invokePath);
});

export default getLocaleFromHeader;
