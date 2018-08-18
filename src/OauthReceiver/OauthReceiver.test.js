import React from 'react';
import { cleanup, render, waitForElement } from 'react-testing-library';
import qs from 'qs';
import { OauthReceiver } from './index';
import { fetch2 } from '../utils/fetch';

jest.mock('../utils/fetch.js', () => ({
  fetch2: jest.fn(() => Promise.resolve({ access_token: 'foo' })),
}));

afterEach(cleanup);

describe('Component <OauthReceiver />', () => {
  test('with default fetch args', async () => {
    const onAuthSuccess = jest.fn();
    const onAuthError = jest.fn();

    const props = {
      tokenUrl: 'https://api.service.com/oauth2/token',
      clientId: 'abc',
      clientSecret: 'abcdef',
      redirectUri: 'https://www.test.com/redirect',
      querystring: `?${qs.stringify({
        code: 'abc',
        state: JSON.stringify({ from: '/success' }),
      })}`,
      onAuthSuccess,
      onAuthError,
    };

    const { getByTestId } = render(
      <OauthReceiver
        {...props}
        render={({ processing, state }) => (
          <div>
            {processing && <span data-testid="done">done</span>}
            <span data-testid="state">{state && state.from}</span>
          </div>
        )}
      />,
    );

    await waitForElement(() => getByTestId('done'));

    expect(onAuthSuccess).toHaveBeenCalledTimes(1);
    expect(onAuthError).not.toHaveBeenCalled();

    expect(getByTestId('state')).toHaveTextContent('/success');
  });

  test('with custom token uri fetch args', async () => {
    fetch2.mockClear();

    const props = {
      tokenUrl: 'https://api.service.com/oauth2/token',
      tokenFetchArgs: {
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      clientId: 'abc',
      clientSecret: 'abcdef',
      redirectUri: 'https://www.test.com/redirect',
      querystring: `?${qs.stringify({
        code: 'abc',
        state: JSON.stringify({ from: '/settings' }),
      })}`,
    };

    const { getByTestId } = render(
      <OauthReceiver
        {...props}
        render={({ processing }) => (
          <div>{processing && <span data-testid="done">done</span>}</div>
        )}
      />,
    );

    await waitForElement(() => getByTestId('done'));

    expect(fetch2).toHaveBeenCalledWith(
      expect.stringContaining(props.tokenUrl),
      expect.objectContaining({
        method: expect.stringMatching('POST'),
        cache: expect.stringMatching('no-cache'),
        headers: expect.objectContaining({
          'Content-Type': expect.stringMatching(
            'application/x-www-form-urlencoded',
          ),
        }),
      }),
    );
  });
  test('with custom fetch function, default args', async () => {
    const onAuthSuccess = jest.fn();
    const onAuthError = jest.fn();

    const props = {
      tokenUrl: 'https://api.service.com/oauth2/token',
      tokenFn: fetch2,
      clientId: 'abc',
      clientSecret: 'abcdef',
      redirectUri: 'https://www.test.com/redirect',
      querystring: `?${qs.stringify({
        code: 'abc',
        state: JSON.stringify({ from: '/success' }),
      })}`,
      onAuthSuccess,
      onAuthError,
    };

    const { getByTestId } = render(
      <OauthReceiver
        {...props}
        render={({ processing, state }) => (
          <div>
            {processing && <span data-testid="done">done</span>}
            <span data-testid="state">{state && state.from}</span>
          </div>
        )}
      />,
    );

    await waitForElement(() => getByTestId('done'));

    expect(onAuthSuccess).toHaveBeenCalledTimes(1);
    expect(onAuthError).not.toHaveBeenCalled();

    expect(getByTestId('state')).toHaveTextContent('/success');
  });

  test('with custom token function and token uri fetch args', async () => {
    fetch2.mockClear();

    const props = {
      tokenUrl: 'https://api.service.com/oauth2/token',
      tokenFn: fetch2,
      tokenFetchArgs: {
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      clientId: 'abc',
      clientSecret: 'abcdef',
      redirectUri: 'https://www.test.com/redirect',
      querystring: `?${qs.stringify({
        code: 'abc',
        state: JSON.stringify({ from: '/settings' }),
      })}`,
    };

    const { getByTestId } = render(
      <OauthReceiver
        {...props}
        render={({ processing }) => (
          <div>{processing && <span data-testid="done">done</span>}</div>
        )}
      />,
    );

    await waitForElement(() => getByTestId('done'));

    expect(fetch2).toHaveBeenCalledWith(
      expect.stringContaining(props.tokenUrl),
      expect.objectContaining({
        method: expect.stringMatching('POST'),
        cache: expect.stringMatching('no-cache'),
        headers: expect.objectContaining({
          'Content-Type': expect.stringMatching(
            'application/x-www-form-urlencoded',
          ),
        }),
      }),
    );
  });
});
