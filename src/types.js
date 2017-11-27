// @flow

export type UrlParams = {
  [key: string]: string | number | boolean | UrlParams,
};
