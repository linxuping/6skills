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
import 'antd/dist/antd.css';
require('../../css/style.less');

import React from 'react';
import ReactDom from 'react-dom';
import { Menu, Breadcrumb, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

var $ = require('jquery');
import Footer from './footer.jsx';
import CusNavbar from './navbar.jsx';
import Sidebar from './sibebar.jsx';



class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'Layout';
  }

  componentDidMount() {
    this.onResize();
    $(window).resize(function(event) {
      this.onResize();
    }.bind(this));
  }

  onResize(){
    let content = ReactDom.findDOMNode(this.refs.content);
    let bodyHeight = document.body.offsetHeight;
    content.style.height = (bodyHeight - 95) + "px";
    console.log(bodyHeight)
  }

  render() {
    const {children, props} = this.props;
    return (
      <div className="ant-layout-topaside">
        <CusNavbar></CusNavbar>
        <div className="ant-layout-wrapper">
          <div className="ant-layout-container">
            <Sidebar/>
            <div className="ant-layout-content" ref="content">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Layout;

