import BaseController from './base-controller.js';
var $ = require('jquery');

export default class ActivityController extends BaseController{

  /**
   * 添加课程
   */
  add(params, success, fail, error, always){
    this.post("/api/admin/activities/add", params, success, fail, error, always);
  }

  /**
   * 获取城市
   */
  fatchCity(params, success, fail) {
  	this.get("/api/admin/get-cities", params, success, fail);
  }

  /**
   * 获取地区
   */
  fatchArea(params, success, fail) {
  	this.get("/api/admin/get-areas", params, success, fail);
  }

  /**
   * 获取类型
   */
  fatchActTypes(params, success){
  	this.get("/api/admin/get-acttypes", params, success);
  }

  /**
   * 获取已发布活动
   */
  fatchPublishActivities(params, success){
    this.get("/api/admin/activities/published", params, success);
  }

  /**
   * 获取未发布活动
   */
  fatchUnpublishActivities(params, success){
    this.get("/api/admin/activities/unpublish", params, success);
  }

  /**
   * 课程下线
   */
  offLineActivity(params, success){
    this.post("/api/admin/activities/offline", params, success);
  }

  /**
   * 退款列表
   */
  fatchRefundList(params, success){
    this.get("/api/admin/activities/refund-list", params, success);
  }

}
