import React from 'react';
import Footer from './footer.jsx';
require('../../lib/css/bootstrap.min.css');
require('../../lib/css/ace.min.css');
require('../../css/style.less');

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Layout';
    }
    render() {
    		const {children, props} = this.props;
        return (
					<div className="app-content">
						{children}
						<Footer />
					</div>
				);
    }
}

export default Layout;
