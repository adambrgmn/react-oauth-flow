import React from 'react';
import { shallow } from 'enzyme';
import { OauthSender } from './index';
import { buildURL } from '../utils';

test('Component: <OauthSender />', () => {
  const props = {
    baseUrl: 'https://www.service.com',
    clientId: 'abc',
    redirectUri: 'https://www.test.com/redirect',
    render: (
      { url }, // eslint-disable-line
    ) => (
      <a className="link" href={url}>
        Connect
      </a>
    ),
  };

  const wrapper = shallow(<OauthSender {...props} />);
  let expectedUrl = buildURL(`${props.baseUrl}/oauth2/authorize`, {
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
    response_type: 'code',
  });

  expect(wrapper.find('.link').prop('href')).toEqual(expectedUrl);

  wrapper.setProps({ ...props, authorizeEndpoint: '/oauth2/auth' });
  expectedUrl = buildURL(`${props.baseUrl}/oauth2/auth`, {
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
    response_type: 'code',
  });

  expect(wrapper.find('.link').prop('href')).toEqual(expectedUrl);
});
