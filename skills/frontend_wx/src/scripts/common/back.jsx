import React, {PropTypes} from 'react';

export default class Back extends React.Component {
  constructor(props) {
    super(props);
  }

  backHandler(){
    history.back();
  }

  render() {
    return (
      <div className="back-btn" onClick={this.backHandler}>{this.props.title || "返回"}</div>
    );
  }
}
