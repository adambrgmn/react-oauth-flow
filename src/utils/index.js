// @flow
import qs from 'qs';
import { fetch2 } from './fetch';

function buildURL(url, params, paramsSerializer): string {
  if (params == null) return url;

  let serializedParams;

  if (paramsSerializer != null) {
    serializedParams = paramsSerializer(params);
  } else {
    serializedParams = qs.stringify(params);
  }

  if (!serializedParams) return url;
  return `${url}${url.indexOf('?') < 0 ? '?' : '&'}${serializedParams}`;
}

export { buildURL, fetch2 };
