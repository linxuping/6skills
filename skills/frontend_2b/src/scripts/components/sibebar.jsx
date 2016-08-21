/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      ."" '<  `.___\_<|>_/___.'  >'"".
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         佛祖保佑       永无BUG
*/

import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';

import {Nav, NavItem, NavDropdown, MenuItem, Dropdown} from 'react-bootstrap';

export default class Sidebar extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    menus: [
      {id: "index", name: "首页", fa: "fa-home", href: "/"},
      {name: "管理", fa: "fa-cogs", href: "#",
       submenu: [
         {id: "act-manager", name: "活动管理", href: "#"},
         {id: "auth-manager", name: "商户认证审核", href: "#"},
         {id: "perf-manager", name: "限时优惠", href: "#"},
       ]
      },
      {name: "统计", fa: "fa-list", href: "#",
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

  render() {
    return (
      <div id="sidebar" className="sidebar responsive ace-save-state" >

        <ul className="nav nav-list">
          {
            this.state.menus.map(function(elem, index) {
              return (
                <li key={index} className={this.state.url == elem.href ? "active": ""}>
                  <a href={elem.href} className={elem.submenu == undefined ? "": "dropdown-toggle"}>
                    <i className={"menu-icon fa fa-fw " + elem.fa}></i>
                    <span className="menu-text">{elem.name}</span>

                    {
                      elem.submenu == undefined ? "": <b className="arrow fa fa-angle-down"></b>
                    }

                  </a>
                  <b className="arrow"></b>
                  {
                    elem.submenu == undefined ? "" :
                      <ul className="submenu">
                        {
                          elem.submenu.map(function(elem, index) {
                            return (
                              <li key={index} className={this.state.url == elem.href ? "active": ""}>
                                <a href={elem.href}>
                                  <i className="menu-icon fa fa-caret-right"></i>
                                  {elem.name}
                                </a>
                              </li>
                            )
                          }.bind(this))
                        }
                      </ul>
                  }
                </li>
              )
            }.bind(this))
          }
        </ul>
      </div>
    );
  }
}
