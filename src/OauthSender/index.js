// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { buildURL } from '../utils';

export class OauthSender extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    redirectUri: PropTypes.string.isRequired,
    authorizeEndpoint: PropTypes.string,
    state: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]),
    ),
    args: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
      ]),
    ),
    render: PropTypes.func,
    component: PropTypes.element,
    children: PropTypes.func,
  };

  static defaultProps = {
    authorizeEndpoint: '/oauth2/authorize',
    state: null,
    args: null,
    render: null,
    component: null,
    children: null,
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
