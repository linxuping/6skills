import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link, Router, Route, hashHistory, IndexRoute} from 'react-router';


import Layout from './components/layout.jsx';
import Home from './components/superadmin/home.jsx';

ReactDom.render((
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home}/>
    </Route>
  </Router>
  ), document.getElementById('app')
);
