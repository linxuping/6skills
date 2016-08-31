import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link, Router, Route, hashHistory, IndexRoute} from 'react-router';

import Layout from './components/authentication/layout.jsx';
import Signin from './components/authentication/signin.jsx';
import Signup from './components/authentication/signup.jsx';


ReactDom.render((

	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Signin}/>
			<Route path="signin" component={Signin}></Route>
			<Route path="signup" component={Signup}></Route>
		</Route>
	</Router>
	), document.getElementById('app')
);
