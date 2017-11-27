// @flow
import * as React from 'react';
import qs from 'qs';
import { buildURL } from '../utils';
import type { UrlParams } from '../types';

type RenderProps = {
  processing: boolean,
  state?: UrlParams,
  error: ?Error,
};

type Props = {
  baseUrl: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
  location?: { search: string },
  querystring?: string,
  render: RenderProps => React.Node,
  onAuthSuccess: ({
    accessToken: string,
    info: { [key: string]: any },
  }) => void,
};

type State = {
  processing: boolean,
  error: ?Error,
};

export class OauthReceiver extends React.Component<Props, State> {
  state = {
    processing: true,
    error: null,
  };

  componentDidMount() {
    this.getAuthorizationCode();
  }

  getAuthorizationCode = async () => {
    const { baseUrl, clientId, clientSecret, redirectUri } = this.props;

    const { code } = this.parseQuerystring();
    const url = buildURL(`${baseUrl}/oauth2/token`, {
      code,
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    try {
      const res = await fetch(url, { method: 'POST' });
      const json = await res.json();
      const { access_token: accessToken, ...rest } = json;
    } catch (error) {
      this.handleError(error);
    }
  };

  handleError = (error: Error) => {
    this.setState(() => ({ error }));
  };

  parseQuerystring = (): { code: string, state?: UrlParams } => {
    const { location, querystring } = this.props;

    if (location != null) return qs.parse(location.search);
    if (querystring != null) return qs.parse(querystring);

    const { search } = window.location;
    return qs.parse(search);
  };

  render() {
    const { processing, error } = this.state;
    return this.props.render({ processing, error });
  }
}
