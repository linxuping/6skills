import React, { Component, PropTypes } from 'react';
import Back from '../../common/back.jsx';

export default class Signinfo extends Component {

  static propTypes = {}

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signview">
        <Back></Back>
        
        报名信息
      </div>
    );
  }
}
