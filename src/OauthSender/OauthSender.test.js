import React from 'react';
import { shallow } from 'enzyme';
import { OauthSender } from './index';
import { buildURL } from '../utils';

test('Component: <OauthSender />', () => {
  const props = {
    authorizeUrl: 'https://www.service.com/oauth2/authorize',
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
  const expectedUrl = buildURL(`${props.authorizeUrl}`, {
    client_id: props.clientId,
    redirect_uri: props.redirectUri,
    response_type: 'code',
  });

  expect(wrapper.find('.link').prop('href')).toEqual(expectedUrl);
});
