// @flow
import * as React from 'react';

type Props = {
  render: ({ processing: boolean }) => React.Node,
};

type State = {
  processing: boolean,
};

export class OauthReceiver extends React.Component<Props, State> {
  componentDidMount() {
    console.log('mounted');
  }

  render() {
    const { processing } = this.state;
    return this.props.render({ processing });
  }
}
