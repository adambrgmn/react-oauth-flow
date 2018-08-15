/* eslint-disable react/prop-types */
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { OauthSender } from './index';
import { buildURL } from '../utils';

afterEach(cleanup);

test('Component: <OauthSender />', () => {
  const props = {
    authorizeUrl: 'https://www.service.com/oauth2/authorize',
    clientId: 'abc',
    redirectUri: 'https://www.test.com/redirect',
    render: ({ url }) => (
      <a data-testid="link" href={url}>
        Connect
      </a>
    ),
  };

  const { getByTestId } = render(<OauthSender {...props} />);

  const expectedUrl = buildURL(props.authorizeUrl, {
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
    response_type: 'code',
  });

  expect(getByTestId('link')).toHaveAttribute('href', expectedUrl);
});
