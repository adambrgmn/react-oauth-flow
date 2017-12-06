import * as React from 'react';
import { OauthReceiver } from '../OauthReceiver';
import { OauthSender } from '../OauthSender';

export function createOauthFlow(
  { authorizeUrl, tokenUrl, clientId, clientSecret, redirectUri } = {},
) {
  const Sender = props => (
    <OauthSender
      authorizeUrl={authorizeUrl}
      clientId={clientId}
      redirectUri={redirectUri}
      {...props}
    />
  );

  const Receiver = props => (
    <OauthReceiver
      tokenUrl={tokenUrl}
      clientId={clientId}
      clientSecret={clientSecret}
      redirectUri={redirectUri}
      {...props}
    />
  );

  return {
    Sender,
    Receiver,
  };
}
