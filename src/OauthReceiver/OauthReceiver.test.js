import React from 'react';
import { mount } from 'enzyme';
import qs from 'qs';
import nock from 'nock';
import { OauthReceiver } from './index';

const delay = dur => new Promise(resolve => setTimeout(resolve, dur));

beforeAll(() => {
  const api = nock('https://api.service.com/');

  api
    .post('/oauth2/token')
    .query({
      code: 'abc',
      grant_type: 'authorization_code',
      client_id: 'abc',
      client_secret: 'abcdef',
      redirect_uri: 'https://www.test.com/redirect',
    })
    .reply(200, {
      access_token: '123',
      token_type: 'bearer',
      account_id: '123456',
    });
});

test('Component <OauthReceiver />', async () => {
  const onAuthSuccess = jest.fn();
  const onAuthError = jest.fn();

  const props = {
    tokenUrl: 'https://api.service.com/oauth2/token',
    clientId: 'abc',
    clientSecret: 'abcdef',
    redirectUri: 'https://www.test.com/redirect',
    querystring: `?${qs.stringify({
      code: 'abc',
      state: JSON.stringify({ from: '/settings' }),
    })}`,
    onAuthSuccess,
    onAuthError,
  };

  const wrapper = mount(
    <OauthReceiver
      {...props}
      render={({ processing, state }) => (
        <div>
          <span className="processing">{processing ? 'yes' : 'no'}</span>
          <span className="state">{state && state.from}</span>
        </div>
      )}
    />,
  );

  expect(wrapper.find('.processing').text()).toBe('yes');
  await delay(10);
  expect(wrapper.find('.processing').text()).toBe('no');
  expect(wrapper.find('.state').text()).toBe('/settings');

  const successCall = onAuthSuccess.mock.calls[0];
  expect(onAuthSuccess.mock.calls.length).toBe(1);
  expect(successCall[0]).toBe('123');
  expect(successCall[1]).toEqual({
    response: {
      access_token: '123',
      token_type: 'bearer',
      account_id: '123456',
    },
    state: { from: '/settings' },
  });

  expect(onAuthError.mock.calls.length).toBe(0);
});
