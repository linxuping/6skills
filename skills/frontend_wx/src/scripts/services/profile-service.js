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

  /**
   * 验证手机
   */
  verifyPhone(params, scb, fcb) {
    this.fetch("/wxauth", params, scb, fcb, "post");
  }

  /**
   * 获取我的评论详情
   */
  fetchComment(params, scb){
    this.fetch('/sign/comment/get', params, scb);
  }

  /**
   * 评论
   */
  postComment(params, scb){
    this.fetch('/sign/comment', params, scb, null, "post");
  }

  /**
   * 获取退款列表
   */
  fetchRefunds(params, scb) {
    this.fetch('/activities/pay/list', params, scb)
  }

  /**
   * 退款操作
   */
  postRefund(params, scb, fcb) {
    this.fetch('/activities/pay/refund', params, scb, fcb, "post")
  }

}

export default new ProfileService();
