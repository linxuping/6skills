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

  onAddActivityHandler(_this, values, target) {
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
  },

  /**
   * 获取城市列表
   * @param  {component} _this
   * @return
   */
  onFatchCityHandler(_this){
    activityController.fatchCity({province: "广东省"}, function(res){
      _this.setState({
        cities: res.values
      })
    })
  },

  /**
   * 获取区域列表
   * @param  {component} _this
   * @param  {object} params
   * @return
   */
  onFatchAreaHandler(_this, params) {
    activityController.fatchArea(params, function(res){
      _this.setState({
        areas: res.values
      })
    })
  },

  /**
   * 获取活动类型
   * @param  {component} _this
   * @param  {object} params
   * @return
   */
  onFatchActTypesHandler(_this, params){
    activityController.fatchActTypes(params, function (res) {
      if (params.level === 1) {
        _this.setState({
          firstacttype: res.values
        })
      } else if (params.level === 2) {
        _this.setState({
          secondacttype: res.values
        })
      }
    })
  },

  /**
   * 已发布课程
   * @param  {component} _this
   * @param  {object} params
   * @return
   */
  onFatchPublishActivities(_this, params){
    activityController.fatchPublishActivities(params, (res)=>{
      console.log(res);
      _this.setState({
        activities: res.activities,
        pageable: res.pageable,
        loaded: true
      });
    })
  },

  /**
   * 未发布课程
   */
  onFatchUnpublishActivities(_this, params){
    activityController.fatchUnpublishActivities(params, (res)=>{
      _this.setState({
        activities: res.activities,
        pageable: res.pageable,
        loaded: true
      });
    })
  },

  /**
   * 课程下线
   */
  onOffLineActivity(_this, params){
    activityController.offLineActivity(params, (res)=>{
      //重新加载
      _this.fatchActivities();
    })
  },

  onFatchRefundList(_this, params){
    activityController.fatchRefundList(params, (res) => {
      _this.setState({
        refund_list: res.refunds,
        pageable: res.pageable,
        loaded: true
      });
    })
  }

})
