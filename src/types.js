// @flow
import type { Node, ComponentType } from 'react';

export type UrlParams = {
  [key: string]: string | number | boolean | UrlParams,
};

export type SenderProps = {
  baseUrl: string,
  clientId: string,
  redirectUri: string,
  authorizeEndpoint: string,
  state?: UrlParams,
  args?: UrlParams,
  render?: ({ url: string }) => Node,
  component?: ComponentType<{ url: string }>,
  children?: ({ url: string }) => Node,
};

export type FactorySenderProps = {
  baseUrl?: string,
  clientId?: string,
  redirectUri?: string,
  authorizeEndpoint?: string,
  state?: UrlParams,
  args?: UrlParams,
  render?: ({ url: string }) => Node,
  component?: ComponentType<{ url: string }>,
  children?: ({ url: string }) => Node,
};

type RenderProps = {
  processing: boolean,
  state: ?UrlParams,
  error: ?Error,
};

export type ReceiverProps = {
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  tokenEndpoint: string,
  location?: { search: string },
  querystring?: string,
  onAuthSuccess?: (
    accessToken: string,
    response: { [key: string]: any },
  ) => void,
  onAuthError?: (error: Error) => void,
  render?: RenderProps => Node,
  component?: ComponentType<RenderProps>,
  children?: RenderProps => Node,
};

export type FactoryReceiverProps = {
  baseUrl?: string,
  clientId?: string,
  clientSecret?: string,
  redirectUri?: string,
  tokenEndpoint?: string,
  location?: { search: string },
  querystring?: string,
  onAuthSuccess?: (
    accessToken: string,
    response: { [key: string]: any },
  ) => void,
  onAuthError?: (error: Error) => void,
  render?: RenderProps => Node,
  component?: ComponentType<RenderProps>,
  children?: RenderProps => Node,
};
