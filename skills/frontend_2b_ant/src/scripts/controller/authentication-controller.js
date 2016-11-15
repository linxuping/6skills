import BaseController from './base-controller.js';

class AuthenticateController extends BaseController{
  constructor() {
    super();
  }

  signin(params, success, fail, error, always){
    this.post("/api/admin/login", params, success, fail, error, always);
  }

}

export default new AuthenticateController();
