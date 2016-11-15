import BaseController from './base-controller.js';

class AuditController extends BaseController{

  /**
   * 获取商户列表
   */
  fatchAudits(params, success){
    this.get("/api/admin/business/list", params, success);
  }

  /**
   * 获取商户具体信息
   */
  fatchAuditDetail(params, success){
    this.get("/api/admin/business/detail", params, success);
  }

  /**
   * 商户认证
   */
  authHandler(params, cb){
    this.post("/api/admin/business/auth", params, cb);
  }

}


export default new AuditController();
