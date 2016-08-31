import React, { Component, PropTypes } from 'react';

import ActivityList from '../activity/activity-list.jsx';

class Home extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content">
        <ActivityList />
      </div>
    );
  }
}

export default Home;
