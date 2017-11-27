import React from 'react';
import { shallow } from 'enzyme';
import { OauthSender } from './index';
import { buildURL } from '../utils';

test('Component: <OauthSender />', () => {
  const props = {
    baseUrl: 'https://www.service.com',
    clientId: 'abc',
    redirectUri: 'https://www.test.com/redirect',
    render: ({ url }) => (
      <a className="link" href={url}>
        Connect
      </a>
    ), // eslint-disable-line
  };

  const wrapper = shallow(<OauthSender {...props} />);
  const expectedUrl = buildURL(`${props.baseUrl}/oauth2/authorize`, {
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
  });

  expect(wrapper.find('.link').prop('href')).toEqual(expectedUrl);
});
