import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';

//import {notification} from 'antd';
import AuditAction from '../actions/audit-action.jsx';
import auditController from '../controller/audit-controller.js';

export default Reflux.createStore({

  listenables: [AuditAction],

  onFatchAudits(_this, params){
    auditController.fatchAudits(params, (res) => {
      console.log(res);
    })
  },

  onFatchAuditDetail(_this, params){
    auditController.fatchAuditDetail(params, (res) => {
      console.log(res);
    })
  },

  onAuthHandler(_this, params){
    auditController.authHandler(params, (res) => {
      console.log(res);
    })
  }

})
