import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link} from 'react-router';

import { Menu, Breadcrumb, Icon } from 'antd';
const MenuItem = Menu.Item;

export default class CusNavbar extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    username: "浪里白条"
  };

  render() {
    const avatar = require('images/default_avatar.jpg');
    return (
      <div className="ant-layout-header">
        <div className="ant-layout-wrapper">
          <div className="ant-layout-logo">LOGO</div>
          <Menu mode="horizontal" className="fr mr30">
            <MenuItem className="add-item">
              <Link to="/activities/add" title="发布新活动">
                <Icon type="plus"></Icon>
              </Link>
            </MenuItem>
            <Menu.SubMenu className="usr-item"
              title={<span><img src={avatar} className="avatar"/>{this.state.username}</span>}>
              <MenuItem>
                <Link to="/profile">
                  <Icon type="user"/>
                  用户信息
                </Link>
              </MenuItem>
              <MenuItem>
                <a href="/signout">
                  <Icon type="logout"></Icon>
                  退出
                </a>
              </MenuItem>
            </Menu.SubMenu>
          </Menu>
        </div>
      </div>
    );
  }
}
