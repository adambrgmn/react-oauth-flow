// @flow
import * as React from 'react';
import qs from 'qs';
import { buildURL } from '../utils';
import { fetch } from '../utils/fetch';
import type { ReceiverProps, UrlParams } from '../types';

type State = {
  processing: boolean,
  state: ?UrlParams,
  error: ?Error,
};

export class OauthReceiver extends React.Component<ReceiverProps, State> {
  static defaultProps = {
    tokenEndpoint: '/oauth2/token',
  };

  state = {
    processing: true,
    state: null,
    error: null,
  };

  componentDidMount() {
    this.getAuthorizationCode();
  }

  getAuthorizationCode = async () => {
    try {
      const {
        baseUrl,
        clientId,
        clientSecret,
        redirectUri,
        tokenEndpoint,
        onAuthSuccess,
      } = this.props;

      const { error, error_description, code, state } = this.parseQuerystring();
      this.setState(() => ({ state }));

      if (error != null) {
        const err = new Error(error_description);
        throw err;
      }

      const url = buildURL(`${baseUrl}${tokenEndpoint}`, {
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      });

      const response = await fetch(url, { method: 'POST' });
      const accessToken: string = response.access_token;

      if (typeof onAuthSuccess === 'function') {
        onAuthSuccess(accessToken, response);
      }

      this.setState(() => ({ processing: false }));
    } catch (error) {
      this.handleError(error);
    }
  };

  handleError = (error: Error) => {
    const { onAuthError } = this.props;

    this.setState(() => ({ error }));
    if (typeof onAuthError === 'function') {
      onAuthError(error);
    }
  };

  parseQuerystring = () => {
    const { location, querystring } = this.props;
    let search;

    if (location != null) {
      search = location.search; // eslint-disable-line
    } else if (querystring != null) {
      search = querystring;
    } else {
      search = window.location.search; // eslint-disable-line
    }

    return qs.parse(search);
  };

  render() {
    const { component, render, children } = this.props;
    const { processing, state, error } = this.state;

    if (component != null) {
      return React.createElement(component, { processing, state, error });
    }

    if (render != null) {
      return render({ processing, state, error });
    }

    if (children != null) {
      React.Children.only(children);
      return children({ processing, state, error });
    }

    return null;
  }
}
