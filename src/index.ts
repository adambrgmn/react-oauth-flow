import React from 'react';
import qs from 'qs';
import { usePromise } from '@fransvilhelm/hooks';

export enum GrantType {
  token = 'token',
  code = 'code',
}

export interface OauthConfig<Account> {
  grantType: GrantType;
  authorizeEndpoint: string;
  clientId: string;
  redirectUri?: string;
  authorizeParameters?: Record<string, string | boolean>;
  currentAccountEndpoint?: string;
  getCurrentAccount?: (token: string) => Promise<Account>;
  validateState?: (state: string) => Promise<boolean>;
}

interface AuthResponse {
  access_token?: string;
  state?: string;
}

export function createOauthFlow<Account = any>(config: OauthConfig<Account>) {
  const useOauthSender = (state?: string) => {
    let params = qs.stringify({
      response_type: config.grantType,
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state,
      ...config.authorizeParameters,
    });

    let endpoint = `${config.authorizeEndpoint}?${params}`;
    let authorize = React.useCallback(() => window.location.replace(endpoint), [
      endpoint,
    ]);

    return [endpoint, authorize];
  };

  const useOauthReciever = () => {
    const searchRef = React.useRef(window.location.search.substring(1));
    const hashRef = React.useRef(window.location.hash.substring(1));

    const [state, result, error] = usePromise<Account>(async () => {
      let token: string;
      let state: string | void;

      if (config.grantType === GrantType.code) {
        const search: AuthResponse = qs.parse(searchRef.current);

        if (!search.access_token) {
          let errorMessage = 'No access token found in search params.';

          if (__DEV__) {
            errorMessage +=
              ' Using react-oauth-flow with config.grantType=GrantType.code ' +
              'requires that your server returns the bearer token as part of ' +
              'the urls search params (e.g. https://my-site.com?access_token={token}).';
          }

          throw new Error(errorMessage);
        }

        token = search.access_token;
        state = search.state;
      } else {
        const hash: AuthResponse = qs.parse(hashRef.current);

        if (!hash.access_token) {
          let errorMessage = 'No access token found in hash fragment.';

          if (__DEV__) {
            errorMessage +=
              ' Using react-oauth-flow with config.grantType=GrantType.token ' +
              'requires that the authorize endpoint returns an access token as ' +
              'part of the url fragment (e.g. https://my-site.com#access_token={token}).';
          }

          throw new Error(errorMessage);
        }

        token = hash.access_token;
        state = hash.state;
      }

      if (state && config.validateState) {
        const valid = await config.validateState(state);
        if (!valid) throw new Error('Oauth state validation failed');
      }

      if (config.getCurrentAccount) {
        const account = await config.getCurrentAccount(token);
        return account;
      }

      if (config.currentAccountEndpoint) {
        const account = await fetchAccount<Account>(
          config.currentAccountEndpoint,
          token,
        );

        return account;
      }

      let errorMessage =
        'You must either provide an endpoint to fetch the current account ' +
        'from or prodvide a function to fetch it.';
      throw new Error(errorMessage);
    }, []);
  };

  return { useOauthSender, useOauthReciever };
}

async function fetchAccount<Account>(
  endpoint: string,
  token: string,
): Promise<Account> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const account: Account = await res.json();
    return account;
  } catch (error) {
    throw new Error('Could not fetch user account with provided access token');
  }
}
