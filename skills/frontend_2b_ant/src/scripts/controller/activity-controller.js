import BaseController from './base-controller.js';
var $ = require('jquery');

export default class ActivityController extends BaseController{

  add(params, success, fail){
    this.post("/api/admin/activities/add", params, success, fail);
  }

}
