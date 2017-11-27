// @flow
import qs from 'qs';
import type { UrlParams } from '../types';

export function buildURL(
  url: string,
  params?: UrlParams,
  paramsSerializer?: (params: UrlParams) => string,
): string {
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
