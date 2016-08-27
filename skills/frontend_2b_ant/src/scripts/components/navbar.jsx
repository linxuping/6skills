import React from 'react';
import { Menu, Breadcrumb, Icon } from 'antd';

export default class CusNavbar extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    username: "administrator"
  };

  render() {
    return (
      <div className="ant-layout-header">
        <div className="ant-layout-wrapper">
          <div className="ant-layout-logo">LOGO</div>

        </div>
      </div>
    );
  }
}
