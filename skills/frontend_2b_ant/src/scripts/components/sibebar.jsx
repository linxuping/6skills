import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import {Menu, Icon} from 'antd';
const SubMenu = Menu.SubMenu;
import {Link, IndexLink} from "react-router";


export default class Sidebar extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    current: 'index',
    openKeys: [''],
    menus: [
      {id: "index", name: "首页", icon: "home", href: "/"},
      {name: "管理", icon: "setting", href: "#", id: "manager",
       submenu: [
         {id: "act-manager", name: "课程管理", href: "#"},
         {id: "audit", name: "商户认证审核", href: "/manager-audit"},
         {id: "refund", name: "退款审核", href: "/manager-refund"},
       ]
      },
      {name: "统计", icon: "bar-chart", href: "#", id: "analytics",
        submenu: [
          {id: "applicants", name: "活动报名统计", href:"/analytics-applicants"}
        ]
      }
    ]
  };

  componentWillMount() {
    let path = window.location.hash.slice(2).split("?")[0];
    let current, openKeys;
    if (path == "") {
      current = "index";
      openKeys = [""];
    } else {
      current = path.split("-")[1];
      openKeys = [path.split("-")[0]];
    }
    this.setState({
      current: current,
      openKeys: openKeys
    });
  }

  componentDidMount() {

  }

  handleClick(e) {
    let openKeys = e.keyPath.slice(1) || [""];
    this.setState({
      current: e.key,
      openKeys: openKeys,
    });
  }

  onToggle(info) {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
    })
  }

  render() {
    return (
      <aside className="ant-layout-sider">
        <Menu mode="inline"
          defaultSelectedKeys={[this.state.current]}
          defaultOpenKeys={this.state.openKeys}
          onClick={this.handleClick.bind(this)}
          onOpenChange={this.onToggle.bind(this)}>
          {
            this.state.menus.map(function(elem, index) {
              if (elem.submenu) {
                return (
                  <SubMenu key={elem.id}
                    title={<span><Icon type={elem.icon} />{elem.name}</span>}>
                    {
                      elem.submenu.map(function(elem, index) {
                        return (
                          <Menu.Item key={elem.id} >
                            <Link to={elem.href}>{elem.name}</Link>
                          </Menu.Item>
                        );
                      }.bind(this))
                    }
                  </SubMenu>
                )
              } else {
                return (
                  <Menu.Item key={elem.id}>
                    <IndexLink to={elem.href}>
                      <Icon type={elem.icon}/>{elem.name}
                    </IndexLink>
                  </Menu.Item>
                );
              }
            }.bind(this))
          }
        </Menu>
      </aside>
    );
  }
}
