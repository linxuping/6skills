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
    openKeys: [],
    menus: [
      {id: "index", name: "首页", icon: "home", href: "/"},
      {name: "管理", icon: "setting", href: "#", id: "manager",
       submenu: [
         {id: "act-manager", name: "活动管理", href: "#"},
         {id: "auth-manager", name: "商户认证审核", href: "#"},
         {id: "perf-manager", name: "限时优惠", href: "#"},
       ]
      },
      {name: "统计", icon: "bar-chart", href: "#", id: "analytics",
        submenu: [
          {id: "analytics", name: "活动报名统计", href:"#"}
        ]
      }
    ]
  };

  componentDidMount() {
    var path = window.location.pathname;
    console.log(path)
    this.setState({
      url: path
    });
  }

  handleClick(e) {
    this.setState({
      current: e.key,
      openKeys: [e.keyPath.slice(1)] || [],
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
          onOpen={this.onToggle.bind(this)}
          onClose={this.onToggle.bind(this)}>
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
                            <a href="#">{elem.name}</a>
                          </Menu.Item>
                        );
                      }.bind(this))
                    }
                  </SubMenu>
                )
              } else {
                return (
                  <Menu.Item key={elem.id}>
                    <Link to={elem.href}>
                      <Icon type={elem.icon}/>{elem.name}
                    </Link>
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
