import React from 'react';

import TweetApp from './TweetApp';
import OtherApp from './OtherApp';

class App extends React.Component {
  state = { showTweetApp: false };

  onSwitchClick = () => {
    this.setState(prevState => {
      return {
        showTweetApp: !prevState.showTweetApp,
      };
    });
  };

  render() {
    const { showTweetApp } = this.state;
    return (
      <div>
        <button onClick={this.onSwitchClick}>Switch</button>
        {showTweetApp && <TweetApp/>}
        {!showTweetApp && <OtherApp/>}
      </div>
    );
  }
}

export default App;
