import Service from './service';

class ActivitieService extends Service {
  constructor() {
    super()
  }

  fetchHotActivities(cb){
    this.fetch("/activities/hot/list", null, cb);
  }

  fetchFilter(url, cb){
    this.fetch(url || '/wx/acttypes/list',null,cb);
  }

  fetchActivities(params, cb){
    this.fetch('/activities/special-offers', params, cb);
  }

  fetchActivityDetails(params, cb) {
    this.fetch('/activities/details', params, cb);
  }

  /**
   * 报名
   */
  postSignup(params, scb, fcb) {
    this.fetch('/activities/sign', params, scb, fcb, "post")
  }

  /**
   * js sdk 签名
   */
  fetchJsSignature(params, scb, fcb){
    this.fetch("/get_js_signature", params, scb, fcb);
  }

  /**
   * 报名收藏等状态
   */
  fetchSignupStatus(params, scb){
    this.fetch('/activities/get_signup_status', params, scb);
  }

  /**
   * 收藏
   */
  collectPost(params, scb, fcb){
    this.fetch("/activities/collect", params, scb, fcb, "post");
  }

  fetchSigninfo(params, scb){
    this.fetch('/signupinfo/get', params, scb)
  }

  /**
   * 付款信息
   */
  fetchWxPayInfo(params, scb) {
    this.fetch("/get_wx_payinfo", params, scb)
  }
}


export default new ActivitieService();
