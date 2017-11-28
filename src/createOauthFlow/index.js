// @flow
import * as React from 'react';
import { OauthReceiver } from '../OauthReceiver';
import { OauthSender } from '../OauthSender';
import type { FactorySenderProps, FactoryReceiverProps } from '../types';

type Props = {
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  authorizeEndpoint?: string,
  tokenEndpoint?: string,
};

type OauthFlow = {
  Sender: React.ComponentType<FactorySenderProps>,
  Receiver: React.ComponentType<FactoryReceiverProps>,
};

export function createOauthFlow(
  {
    baseUrl,
    clientId,
    clientSecret,
    redirectUri,
    authorizeEndpoint = '/oauth2/authorize',
    tokenEndpoint = '/oauth2/token',
  }: Props = {},
): OauthFlow {
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
