import React, { Component } from 'react';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';

class App extends Component {
  render() {
    return (
      <Icon path={mdiAccount}
        title="User Profile"
        size={1}
        horizontal
        vertical
        rotate={90}
        color="red"
        spin
      />
    );
  }
};