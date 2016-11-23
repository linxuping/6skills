import service from './service.js';


class ProfileService extends service {

  /**
   * get user info
   */
  fetchUserInfo(cb){
    this.fetch("/activities/get_profile", null, cb);
  }

  /**
   * get my activities
   */
  fetchMyActivities(url, params, cb){
    this.fetch(url || "/activities/my", params, cb);
  }
  /**
   * 取消报名
   */
  resetSignup(params, scb, fcb){
    this.fetch("/activities/reset", params, scb, fcb, "post");
  }

  /**
   * 获取收藏活动
   */
  fetchCollections(params, cb){
    this.fetch("/activities/mycollections", params, cb);
  }

  /**
   * 删除收藏的活动
   */
  delCollection(params, scb, fcb){
    this.fetch("/activities/reset_collection", params, scb, fcb, "post");
  }

  /**
   * 获取验证码
   */
  getCode(params, scb, fcb){
    this.fetch('/get-auth-code', params, scb);
  }

  verifyPhone(params, scb, fcb) {
    this.fetch("/wxauth", params, scb, fcb, "post");
  }

}

export default new ProfileService();
