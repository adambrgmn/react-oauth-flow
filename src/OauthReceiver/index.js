// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { buildURL, fetch2 } from '../utils';

class OauthReceiver extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: true,
      state: null,
      error: null,
    };

    this.getAuthorizationCode = this.getAuthorizationCode.bind(this);
    this.handleError = this.handleError.bind(this);
    this.parseQuerystring = this.parseQuerystring.bind(this);
  }

  componentDidMount() {
    this.getAuthorizationCode();
  }

  getAuthorizationCode() {
    try {
      const {
        tokenUrl,
        tokenFetchArgs,
        clientId,
        clientSecret,
        redirectUri,
        args,
        tokenFn,
        onAuthSuccess,
      } = this.props;

      const queryResult = this.parseQuerystring();
      const { error, error_description: errorDescription, code } = queryResult;
      const state = JSON.parse(queryResult.state || null);
      if (state) {
        this.setState(() => ({ state }));
      }

      if (error != null) {
        const err = new Error(errorDescription);
        throw err;
      }

      const url = buildURL(`${tokenUrl}`, {
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        ...args,
      });

      const headers = new Headers({ 'Content-Type': 'application/json' });
      const defaultFetchArgs = { method: 'POST', headers };
      const fetchArgs = Object.assign(defaultFetchArgs, tokenFetchArgs);

      (typeof tokenFn === 'function' ?
        tokenFn(url, fetchArgs) :
        fetch2(url, fetchArgs)
      ).then(response => {
          const accessToken = response.access_token;

          if (typeof onAuthSuccess === 'function') {
            onAuthSuccess(accessToken, { response, state });
          }

          this.setState(() => ({ processing: false }));
        })
        .catch(err => {
          this.handleError(err);
          this.setState(() => ({ processing: false }));
        });
    } catch (error) {
      this.handleError(error);
      this.setState(() => ({ processing: false }));
    }
  }

  handleError(error) {
    const { onAuthError } = this.props;

    this.setState(() => ({ error }));
    if (typeof onAuthError === 'function') {
      onAuthError(error);
    }
  }

  parseQuerystring() {
    const { location, querystring } = this.props;
    let search;

    if (location != null) {
      search = location.search; // eslint-disable-line
    } else if (querystring != null) {
      search = querystring;
    } else {
      search = window.location.search; // eslint-disable-line
    }

    return qs.parse(search, { ignoreQueryPrefix: true });
  }

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

OauthReceiver.propTypes = {
  tokenUrl: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  clientSecret: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  args: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.object,
    ]),
  ),
  location: PropTypes.shape({ search: PropTypes.string.isRequired }),
  querystring: PropTypes.string,
  tokenFn: PropTypes.func,
  onAuthSuccess: PropTypes.func,
  onAuthError: PropTypes.func,
  render: PropTypes.func,
  tokenFetchArgs: PropTypes.shape({
    method: PropTypes.string,
  }),
  component: PropTypes.element,
  children: PropTypes.func,
};

OauthReceiver.defaultProps = {
  args: {},
  location: null,
  querystring: null,
  tokenFn: null,
  onAuthSuccess: null,
  onAuthError: null,
  render: null,
  tokenFetchArgs: {},
  component: null,
  children: null,
};

export { OauthReceiver };
