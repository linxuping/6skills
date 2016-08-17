import React from 'react';
import ReactDom from 'react-dom';
import Layout from './components/layout.jsx';
import {Breadcrumb} from 'react-bootstrap';

ReactDom.render(
  <Layout>
    <div className="main-content-inner">
      <div className="breadcrumbs ace-save-state" id="breadcrumbs">
        <Breadcrumb>
          <Breadcrumb.Item href="#">
            <i className="ace-icon fa fa-home home-icon"></i>
            首页
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>


      <div className="page-content">
        首页
      </div>
    </div>
  </Layout>,
  document.getElementById('app')
);
