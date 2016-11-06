import 'antd/dist/antd.less';
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
