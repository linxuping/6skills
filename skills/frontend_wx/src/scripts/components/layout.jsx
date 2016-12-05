import React, {PropTypes} from 'react';
import utils from '../common/utils';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    utils.load_6soid()
  }

  render() {
    const {children} = this.props;
    return (
      <div className="container">
        {children}
        <div id="msg-wrap"></div>
      </div>
    );
  }
}
