// @flow
import * as React from 'react';
import { buildURL } from '../utils';
import type { UrlParams } from '../types';

type Props = {
  baseUrl: string,
  clientId: string,
  redirectUri: string,
  state?: UrlParams,
  args?: UrlParams,
  render: ({ url: string }) => React.Node,
};

export class OauthSender extends React.Component<Props, *> {
  render() {
    const { baseUrl, clientId, redirectUri, state, args, render } = this.props;
    const url = buildURL(`${baseUrl}/oauth2/authorize`, {
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state || {},
      args: args || {},
    });

    return render({ url });
  }
}
