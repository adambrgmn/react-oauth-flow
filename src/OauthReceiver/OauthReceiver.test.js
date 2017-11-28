import React from 'react';
import { mount } from 'enzyme';
import qs from 'qs';
import { OauthReceiver } from './index';

jest.mock('../utils/fetch.js', () => ({
  fetch: () =>
    Promise.resolve({
      access_token: '123',
      token_type: 'bearer',
      account_id: '123456',
    }),
}));

const delay = dur => new Promise(resolve => setTimeout(resolve, dur));

test('Component <OauthReceiver />', async () => {
  const onAuthSuccess = jest.fn();
  const onAuthError = jest.fn();

  const props = {
    baseUrl: 'http://www.service.com',
    clientId: 'abc',
    clientSecret: 'abcdef',
    redirectUri: 'https://www.test.com/redirect',
    querystring: `?${qs.stringify({
      code: 'abc',
      state: { from: '/settings' },
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
  await delay(0);
  expect(wrapper.find('.processing').text()).toBe('no');
  expect(wrapper.find('.state').text()).toBe('/settings');

  const successCall = onAuthSuccess.mock.calls[0];
  expect(onAuthSuccess.mock.calls.length).toBe(1);
  expect(successCall[0]).toBe('123');
  expect(successCall[1]).toEqual({
    access_token: '123',
    token_type: 'bearer',
    account_id: '123456',
  });

  expect(onAuthError.mock.calls.length).toBe(0);
});
