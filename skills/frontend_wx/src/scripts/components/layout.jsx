import React, {PropTypes} from 'react';


export default class Layout extends React.Component {
  constructor(props) {
    super(props);
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
