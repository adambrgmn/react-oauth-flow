import * as React from 'react';
import { OauthReceiver } from '../OauthReceiver';
import { OauthSender } from '../OauthSender';

export function createOauthFlow(
  {
    baseUrl,
    clientId,
    clientSecret,
    redirectUri,
    authorizeEndpoint = '/oauth2/authorize',
    tokenEndpoint = '/oauth2/token',
  } {},
) {
  const Sender = props => (
    <OauthSender
      baseUrl={baseUrl}
      clientId={clientId}
      redirectUri={redirectUri}
      authorizeEndpoint={authorizeEndpoint}
      {...props}
    />
  );

  const Receiver = props => (
    <OauthReceiver
      baseUrl={baseUrl}
      clientId={clientId}
      clientSecret={clientSecret}
      redirectUri={redirectUri}
      tokenEndpoint={tokenEndpoint}
      {...props}
    />
  );

  return {
    Sender,
    Receiver,
  };
}
