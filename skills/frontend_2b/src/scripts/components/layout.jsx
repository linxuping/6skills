import React from 'react';
var jQuery = require('jquery');
var ace = require('../../lib/js/ace.min.js');
import Footer from './footer.jsx';
import CusNavbar from './navbar.jsx';
import Sidebar from './sibebar.jsx';
require('../../lib/css/bootstrap.min.css');
require('../../lib/css/ace.min.css');
require('../../lib/font-awesome/4.5.0/css/font-awesome.min.css')
require('../../css/style.less');


class Layout extends React.Component {
    constructor(props) {
      super(props);
      this.displayName = 'Layout';
    }

    componentDidMount() {
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

