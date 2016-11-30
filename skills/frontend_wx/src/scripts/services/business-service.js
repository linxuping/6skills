import BaseService from './service';

class BusinessService extends BaseService {
  constructor() {
    super()
  }

  fetchBusinessStatus(params, scb){
    this.fetch("/business/authrization/status", params, scb)
  }

  postApply(params, scb, fcb){
    this.fetch("/business/auth", params, scb, fcb, "post");
  }

}


export default new BusinessService();
