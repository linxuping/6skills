import React, {PropTypes} from 'react';
import 'weui';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;
    return (
      <div className="container">{children}</div>
    );
  }
}
