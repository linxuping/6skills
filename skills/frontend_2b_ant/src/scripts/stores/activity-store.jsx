import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import ActivityAction from '../actions/activity-action.jsx';
import ActivityController from '../controller/activity-controller.js';
import {notification} from 'antd';

let activityController = new ActivityController();

export default Reflux.createStore({

  listenables: [ActivityAction],

  onAddActivityHandler: function(_this, values, target) {
    target.disabled = true;
    activityController.add(values, function(res){
      notification['success']({
        message: '提示！',
        description: '活动添加成功！',
        duration: 3
      })
      setTimeout(function(){
        location.href = "/";
      }, 3000);
    }, null, null, function(){
      target.disabled = false;
    });
  }

})
