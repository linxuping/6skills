import BaseController from './base-controller.js';
var $ = require('jquery');

export default class ActivityController extends BaseController{

  /**
   * 添加课程
   */
  add(params, success, fail, error, always){
    this.post("/api/admin/activities/add", params, success, fail, error, always);
  }

  
  fatchCity(params, success, fail) {
  	this.get("/api/admin/get-cities", params, success, fail);
  }

  fatchArea(params, success, fail) {
  	this.get("/api/admin/get-areas", params, success, fail);
  }

  fatchActTypes(params, success){
  	this.get("/api/admin/get-acttypes", params, success);
  }

  fatchPublishActivities(params, success){
    this.get("/api/admin/activities/published", params, success);
  }

  fatchUnpublishActivities(params, success){
    this.get("/api/admin/activities/unpublish", params, success);
  }

  offLineActivity(params, success){
    this.post("/api/admin/activities/offline", params, success);
  }

}
