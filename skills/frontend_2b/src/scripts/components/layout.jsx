require('../../lib/css/bootstrap.min.css');
require('../../lib/css/jquery-ui.custom.min.css');
require('../../lib/css/ace.min.css');
require('../../lib/font-awesome/4.5.0/css/font-awesome.min.css')
require('../../css/style.less');

import React from 'react';
require('jquery');
require('react-bootstrap');
require('../../lib/js/ace-elements.min.js');
var ace = require('../../lib/js/ace.min.js');
import Footer from './footer.jsx';
import CusNavbar from './navbar.jsx';
import Sidebar from './sibebar.jsx';



class Layout extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = 'Layout';
    }

    componentDidMount() {
      //一定要这句 可能ace跟jquery版本不对
      jQuery.support.transition = {};
      try{
        ace.settings.loadState('main-container');
        ace.settings.loadState('sidebar');
      }catch(e){}
    }

    render() {
        const {children, props} = this.props;
        return (
          <div className="app-content no-skin">
            <CusNavbar />
            <div className="main-container ace-save-state" id="main-container">
              <Sidebar></Sidebar>
              <div className="main-content">
                {children}
              </div>
              <Footer />
            </div>

          </div>
        );
    }
}

export default Layout;

