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
      <div className="footer">
        <div className="footer-inner">
          <div className="footer-content">
            <span className="bigger-120">
              <span className="blue bolder">6 skills</span>
              &copy; 2016. All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
