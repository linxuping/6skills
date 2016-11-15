import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import authenticateAction from '../actions/authentication-action.jsx';

import controller from '../controller/authentication-controller.js';

export default Reflux.createStore({

  listenables: [authenticateAction],

  onSigninHandler (_this, params) {
    controller.signin(params, (res)=>{
      console.log(res);

    })
  }

})
