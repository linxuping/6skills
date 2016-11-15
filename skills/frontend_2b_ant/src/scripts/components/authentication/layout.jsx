import 'antd/dist/antd.less';
require('css/style.less');

import React from 'react';

export default class Layout extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {children, props} = this.props;
    return (
      <div className="page auth-page">

        {children}

      </div>
    );
  }
}
