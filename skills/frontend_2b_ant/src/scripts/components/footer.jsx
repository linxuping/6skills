import React, { Component, PropTypes } from 'react';

class Footer extends Component {
  static propTypes = {
      className: PropTypes.string,
  };

  state = {
    test: "test"
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="ant-layout-footer">
        <div className="footer-inner">
        </div>
        &copy; 2016. All Right Resevred.
      </footer>
    );
  }
}

export default Footer;
