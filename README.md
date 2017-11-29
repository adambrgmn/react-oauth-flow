# React OAuth Flow

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is `react-oauth-flow`

`react-oauth-flow` is a small library to simplify the use of OAuth2
authentication inside your react applications.

It will bring you a simple component to generate the necessary link to send your
users to the correct location and it will give you a component to perform the
authorization process once the user is back on your site.

## Installation

```sh
npm install react-oauth-flow
yarn add react-oauth-flow
```

## Usage

### <OauthSender />

```js
import React, { Component } from 'react';
import { OauthSender } from 'react-oauth-flow';

export default class SendToDropbox extends Component {
  render() {
    return (
      <OauthSender
        baseUrl="https://www.dropbox.com"
        clientId={process.env.CLIENT_ID}
        redirectUri="https://www.yourapp.com/auth/dropbox"
        state={{ from: '/settings' }}
        render={({ url }) => <a href={url}>Connect to Dropbox</a>}
      />
    );
  }
}
```

Use `<OauthSender />` to send your users to the correct endpoints at your OAuth2
service.

#### Props

| Prop                | Type     | Required | Default             | Description                                                                                        |
| :------------------ | :------- | :------- | :------------------ | :------------------------------------------------------------------------------------------------- |
| `baseUrl`           | `string` | yes      | -                   | Base url of your OAuth2 service provider                                                           |
| `clientId`          | `string` | yes      | -                   | Your client id from the service provider (remember to keep it secret!)                             |
| `redirectUri`       | `string` | yes      | -                   | The URL where the provider should redirect your users back                                         |
| `authorizeEndpoint` | `string` | no       | `/oauth2/authorize` | Endpoint for authorization at your provider                                                        |
| `state`             | `object` | no       | -                   | Additional state to get back from the service provider (read more below)                           |
| `args`              | `object` | no       | -                   | Additional args to send service provider. Will be serialized by [qs](https://github.com/ljharb/qs) |

#### Render

`<OauthSender />` can be used in three ways, either by a render-prop,
children-function or component-prop. In either way the will recieve the
generated `url` as a prop/arg.

```js
const RenderProp = props => (
  <OauthSender {...props} render={({ url }) => <a href={url}>Connect</a>} />
);

const ChildrenFunction = props => (
  <OauthSender {...props}>{({ url }) => <a href={url}>Connect</a>}</OauthSender>
);

const Link = ({ url }) => <a href={url}>Connect</a>;
const ComponentProp = props => <OauthSender {...props} component={Link} />;
```

#### State

You can pase some state along with the auth process. This state will be sent
back by the OAuth-provider once the process is done. This state can then be used
to redirect the user back to where they started the auth process.

### <OauthReceiver />

```js
import React, { Component } from 'react';
import { OauthReceiver } from 'react-oauth-flow';

export default class ReceiveFromDropbox extends Component {
  handleSuccess = (accessToken, { response, state }) => {
    console.log('Successfully authorized');
    getProfileFromDropbox(accessToken);
    redirect(state.from);
  };

  handleError = error => {
    console.error('An error occured');
    console.error(error.message);
  };

  render() {
    return (
      <OauthReceiver
        baseUrl="https://www.dropbox.com"
        clientId={process.env.CLIENT_ID}
        clientSecret={process.env.CLIENT_SECRET}
        redirectUri="https://www.yourapp.com/auth/dropbox"
        onAuthSuccess={this.handleSuccess}
        onAuthError={this.handleError}
        render={({ processing, state, error }) => (
          <div>
            {processing && <p>Authorizing now...</p>}
            {error && (
              <p className="error">An error occured: {error.message}</p>
            )}
          </div>
        )}
      />
    );
  }
}
```

Use `<OauthReceiver />` to handle authorization when the user is being
redirected from the OAuth2-provider.

#### Props

| Prop            | Type                 | Required | Default         | Description                                                                |
| :-------------- | :------------------- | :------- | :-------------- | :------------------------------------------------------------------------- |
| `baseUrl`       | `string`             | yes      | -               | Base url of your OAuth2 service provider                                   |
| `clientId`      | `string`             | yes      | -               | Your client id from the service provider (remember to keep it secret!)     |
| `clientSecret`  | `string`             | yes      | -               | Your client secret from the service provider (remember to keep it secret!) |
| `redirectUri`   | `string`             | yes      | -               | The URL where the provider has redirected your user (used to verify auth)  |
| `tokenEndpoint` | `string`             | no       | `/oauth2/token` | Endpoint for authorization at your provider                                |
| `location`      | `{ search: string }` | no       | -               | Used to extract info from querystring (read more below)                    |
| `querystring`   | `string`             | no       | -               | Used to extract info from querystring (read more below)                    |

#### Events

| Prop            | Args | Required | Description |
| :-------------- | :--- | :------- | :---------- |
| `onAuthSuccess` |      |          |             |

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13746650?v=4" width="100px;"/><br /><sub><b>Adam Bergman</b></sub>](http://fransvilhelm.com)<br />[💻](https://github.com/adambrgmn/react-oauth-flow/commits?author=adambrgmn "Code") [📖](https://github.com/adambrgmn/react-oauth-flow/commits?author=adambrgmn "Documentation") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
