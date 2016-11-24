import React, { Component, PropTypes } from 'react';

export default class Singup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="sign-page">
          
        </div>
      );
    } else {
      return (
        <Toast icon="loading" show={true}>加载中...</Toast>
      );
    }

  }
}

Singup.propTypes = {
};
