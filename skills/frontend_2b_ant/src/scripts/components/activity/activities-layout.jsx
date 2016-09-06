import React, { Component, PropTypes } from 'react';

class ActivitiesLayout extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
			this.props.children ||
				<p>没有活动哦</p>
    );
  }
}

export default ActivitiesLayout;
