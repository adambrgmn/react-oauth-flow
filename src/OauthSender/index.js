// @flow
import * as React from 'react';
import { buildURL } from '../utils';
import type { UrlParams } from '../types';

type Props = {
  baseUrl: string,
  clientId: string,
  redirectUri: string,
  authorizeEndpoint: string,
  state?: UrlParams,
  args?: UrlParams,
  render: ({ url: string }) => React.Node,
};

export class OauthSender extends React.Component<Props, *> {
  static defaultProps = {
    authorizeEndpoint: '/oauth2/authorize',
  };

  render() {
    const {
      baseUrl,
      clientId,
      redirectUri,
      authorizeEndpoint,
      state,
      args,
      render,
    } = this.props;

    const url = buildURL(`${baseUrl}${authorizeEndpoint}`, {
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state || {},
      args: args || {},
    });

    return render({ url });
  }
}
