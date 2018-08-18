# React OAuth Flow

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [What is `react-oauth-flow`](#what-is-react-oauth-flow)
* [Installation](#installation)
* [Requirements](#requirements)
* [Usage](#usage)
  * [`<OauthSender />`](#oauthsender-)
  * [`<OauthReceiver />`](#oauthreceiver-)
  * [`createOauthFlow`](#createoauthflow)
* [License](#license)
* [Contributors](#contributors)

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

There is also a umd-build available for usage directly inside a browser, via
`https://unkpg.com/react-oauth-flow/dist/react-oauth-flow.umd.min.js`.

```html
<script src="https://unkpg.com/react-oauth-flow/dist/react-oauth-flow.umd.min.js"></script>
<script>
  // The umd-build exports a global variable ReactOauthFlow
  const { createOauthFlow, OauthSender, OauthReceiver } = ReactOauthFlow;
</script>
```

## Requirements

`react-oauth-flow` requires
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to be
available on the `window`-object. In modern browsers it's there by default. But
for older browsers you might need to provide it yourself as a polyfill.

If you are using
[`create-react-app`](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#supported-language-features-and-polyfills)
it's already included as a polyfill. Otherwise I recommend
[`whatwg-fetch`](https://github.com/github/fetch) (which `create-react-app` also
uses).

## Usage

`react-oauth-flow` exports three functions:

* [`OauthSender`](#oauthsender-)
* [`OauthReceiver`](#oauthreceiver-)
* [`createOauthFlow`](#createoauthflow)

### `<OauthSender />`

```js
import React, { Component } from 'react';
import { OauthSender } from 'react-oauth-flow';

export default class SendToDropbox extends Component {
  render() {
    return (
      <OauthSender
        authorizeUrl="https://www.dropbox.com/oauth2/authorize"
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

| Prop           | Type     | Required | Default | Description                                                                                                         |
| :------------- | :------- | :------- | :------ | :------------------------------------------------------------------------------------------------------------------ |
| `authorizeUrl` | `string` | yes      | -       | The full url to the authorize endpoint, provided by the service                                                     |
| `clientId`     | `string` | yes      | -       | Your client id from the service provider (remember to keep it secret!)                                              |
| `redirectUri`  | `string` | yes      | -       | The URL where the provider should redirect your users back                                                          |
| `state`        | `object` | no       | -       | Additional state to get back from the service provider [(read more below)](#state)                                  |
| `args`         | `object` | no       | -       | Additional args to send to service provider, e.g. `scope`. Will be serialized by [qs](https://github.com/ljharb/qs) |

#### Render

`<OauthSender />` can be used in three ways, either by a render-prop,
children-function or component-prop. In either way they will recieve the
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

You can pass some state along with the auth process. This state will be sent
back by the OAuth-provider once the process is done. This state can for example
then be used to redirect the user back to where they started the auth process.

### `<OauthReceiver />`

```js
import React, { Component } from 'react';
import { OauthReceiver } from 'react-oauth-flow';

export default class ReceiveFromDropbox extends Component {
  handleSuccess = async (accessToken, { response, state }) => {
    console.log('Successfully authorized');
    await setProfileFromDropbox(accessToken);
    await redirect(state.from);
  };

  handleError = error => {
    console.error('An error occured');
    console.error(error.message);
  };

  render() {
    return (
      <OauthReceiver
        tokenUrl="https://api.dropbox.com/oauth2/token"
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

| Prop             | Type                 | Required | Default | Description                                                                             |
| :--------------- | :------------------- | :------- | :------ | :-------------------------------------------------------------------------------------- |
| `tokenUrl`       | `string`             | yes      | -       | The full url to the token endpoint, provided by the service                             |
| `clientId`       | `string`             | yes      | -       | Your client id from the service provider (remember to keep it secret!)                  |
| `clientSecret`   | `string`             | yes      | -       | Your client secret from the service provider (remember to keep it secret!)              |
| `redirectUri`    | `string`             | yes      | -       | The URL where the provider has redirected your user (used to verify auth)               |
| `args`           | `object`             | no       | -       | Args will be attatched to the request to the token endpoint. Will be serialized by `qz` |
| `location`       | `{ search: string }` | no       | -       | Used to extract info from querystring [(read more below)](#location-and-querystring)    |
| `querystring`    | `string`             | no       | -       | Used to extract info from querystring [(read more below)](#location-and-querystring)    |
| `tokenFetchArgs` | `object`             | no       | `{}`    | Used to fetch the token endpoint [(read more below)](#tokenfetchargs)                   |
| `tokenFn` | `func`             | no       | `null`    | Used to bypass default fetch function to fetch the token [(read more below)](#tokenfn)                   |


#### Events

* `onAuthSuccess(accessToken, result)`

| Arg               | Type     | Description                                                  |
| :---------------- | :------- | :----------------------------------------------------------- |
| `accessToken`     | `string` | Access token recieved from OAuth2 provider                   |
| `result`          | `object` |                                                              |
| `result.response` | `object` | The full response from the call to the token-endpoint        |
| `result.state`    | `object` | The state recieved from provider, if it was provided earlier |

* `onAuthError(error)`

| Arg     | Type    | Description                                        |
| :------ | :------ | :------------------------------------------------- |
| `error` | `Error` | Error with message as description of what happened |

#### Render

`<OauthReceiver />` can be used in three ways, either by a render-prop,
children-function or component-prop. Either way they will recieve three
props/args:

* `processing: boolean`: True if authorization is in progress
* `state: object`: The state received from provider (might be null)
* `error: Error`: An error object if an error occured

```js
const RenderProp = props => (
  <OauthReceiver
    {...props}
    render={({ processing, state, error }) => (
      <div>
        {processing && <p>Authorization in progress</p>}
        {state && <p>Will redirect you to {state.from}</p>}
        {error && <p className="error">Error: {error.message}</p>}
      </div>
    )}
  />
);

const ChildrenFunction = props => (
  <OauthReceiver {...props}>
    {({ processing, state, error }) => (
      <div>
        {processing && <p>Authorization in progress</p>}
        {state && <p>Will redirect you to {state.from}</p>}
        {error && <p className="error">Error: {error.message}</p>}
      </div>
    )}
  </OauthReceiver>
);

const View = ({ processing, state, error }) => (
  <div>
    {processing && <p>Authorization in progress</p>}
    {state && <p>Will redirect you to {state.from}</p>}
    {error && <p className="error">Error: {error.message}</p>}
  </div>
);
const ComponentProp = props => <OauthReceiver {...props} component={View} />;
```

#### `location` and `querystring`

The props `location` and `querystring` actually do the same thing but both can
be ommitted. But what they do is still important. When the OAuth2-provider
redirects your users back to your app they do so with a querystring attatched to
the call. `<OauthReceiver />` parses this string to extract information that it
needs to request an access token.

`location` is especially useful if you're using
[`react-router`](https://github.com/ReactTraining/react-router). Because it
provides you with a `location`-prop with all the information that
`<OauthReceiver />` needs.

`querystring` can be used if you want some control over the process, but
basically it's `window.location.search`. So if it is not provided
`<OauthReceiver />` will fetch the information from `window.location.search`.

#### `tokenFetchArgs`

The prop `tokenFetchArgs` can be used to change how the token is received from
the service. For example, the token service for Facebook requires a `GET`
request but the token service for Dropbox requires a `POST` request. You can
change `tokenFetchArgs` to make this necessary change.

The following are the default fetch args used to fetch the token but they can be
merged and overriden with the `tokenFetchArgs`:

```
{ method: 'GET', headers: { 'Content-Type': 'application/json' }}
```

#### `tokenFn`

The prop `tokenFn` can be used to change how the token is fetched and received from
the service. It's a way to bypass the default fetch all together and use your own.
For example, if your `access-token` comes in the headers instead of the response body
you will have to use your own fetch function to get those. Or perhaps you already
have a custom built fetch function that communicates with your backend and you want
to make use of it.

Your function will receive the `url` from the OauthReceiver, it takes the
`tokenUrl` and builds it up with all the other needed parameters so you don't have to.
It will also receive the `tokenFetchArgs` parameter just in case you need it. if you don't,
just ignore it.

### `createOauthFlow`

```js
import { createOauthFlow } from 'react-oauth-flow';

const { Sender, Receiver } = createOauthFlow({
  authorizeUrl: 'https://www.dropbox.com/oauth2/authorize',
  tokenUrl: 'https://api.dropbox.com/oauth2/token',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'https://www.yourapp.com/auth/dropbox',
});

export { Sender, Receiver };
```

`createOauthFlow` is a shorthand to create instances of both `<OauthSender />`
and `<OauthReceiver />` with equal settings to keep things DRY.

These instances can then be used as described above. All arguments can also be
overridden when you use the created components.

#### Args

| Arg                    | Type     | Required | Default | Description                                                                |
| :--------------------- | :------- | :------- | :------ | :------------------------------------------------------------------------- |
| `options`              | `object` | yes      | -       | Options object                                                             |
| `options.authorizeUrl` | `string` | yes      | -       | The full url to the authorize endpoint, provided by the service            |
| `options.tokenUrl`     | `string` | yes      | -       | The full url to the token endpoint, provided by the service                |
| `options.clientId`     | `string` | yes      | -       | Your client id from the service provider (remember to keep it secret!)     |
| `options.clientSecret` | `string` | yes      | -       | Your client secret from the service provider (remember to keep it secret!) |
| `options.redirectUri`  | `string` | yes      | -       | The URL where the provider should redirect your users back                 |

## License

MIT

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13746650?v=4" width="100px;"/><br /><sub><b>Adam Bergman</b></sub>](http://fransvilhelm.com)<br />[💻](https://github.com/adambrgmn/react-oauth-flow/commits?author=adambrgmn "Code") [📖](https://github.com/adambrgmn/react-oauth-flow/commits?author=adambrgmn "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/35017?v=4" width="100px;"/><br /><sub><b>Jamie Wright</b></sub>](http://tatsu.io)<br />[💻](https://github.com/adambrgmn/react-oauth-flow/commits?author=jwright "Code") [📖](https://github.com/adambrgmn/react-oauth-flow/commits?author=jwright "Documentation") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
