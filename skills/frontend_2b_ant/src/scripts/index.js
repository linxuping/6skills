import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link, Router, Route, hashHistority} from 'react-router';


import Layout from './components/layout.jsx';

ReactDom.render(
  <Layout>
    首页
  </Layout>,
  document.getElementById('app')
);
