// @flow
import * as React from 'react';
import { buildURL } from '../utils';
import type { SenderProps } from '../types';

export class OauthSender extends React.Component<SenderProps, *> {
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
      component,
      children,
    } = this.props;

    const url = buildURL(`${baseUrl}${authorizeEndpoint}`, {
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state || {},
      args: args || {},
    });

    if (component != null) {
      return React.createElement(component, { url });
    }

    if (render != null) {
      return render({ url });
    }

    if (children != null) {
      React.Children.only(children);
      return children({ url });
    }

    return null;
  }
}
