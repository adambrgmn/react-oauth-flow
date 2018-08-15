import qs from 'qs';
import { fetch2 } from './fetch';

function buildURL(url, params) {
  if (params == null) return url;

  const serializedParams = qs.stringify(params)
  if (!serializedParams) return url;
  
  return `${url}${url.indexOf('?') < 0 ? '?' : '&'}${serializedParams}`;
}

export { buildURL, fetch2 };
