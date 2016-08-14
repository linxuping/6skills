import React, { Component, PropTypes } from 'react';

class Footer extends Component {
	static propTypes = {
        className: PropTypes.string,
    };

	state = {
		test: "test"
	};

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer>
				&copy; 2016. All Rights Reserved.
            </footer>
        );
    }
}

export default Footer;
