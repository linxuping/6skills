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
      <div className="back-btn" onClick={this.backHandler}>
        <div className="back">返回</div>
        <div className="back-title">{this.props.children || this.props.title}</div>
      </div>
    );
  }
}
