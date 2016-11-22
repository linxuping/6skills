import "whatwg-fetch"
import utils from '../common/utils';

export default class BaseService {

  constructor(){
    this.openid = utils.getopenid();
  }

  fetch(url, params, scb, fcb, method="get"){

    let options = {method: method};

    //append openid to url
    if (url.indexOf("?") !== -1) {
      url+=`&openid=${this.openid}`
    } else {
      url+=`?openid=${this.openid}`
    }

    if (method=="post" && params != null) {
      //post metod
      options.body = `openid=${this.openid}`;
      Object.keys(params).map(key=>{
        options.body += `&${key}=${params[key]}`;
      })
      options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    } else if(method=="get" && params != null) {
      //get method params
      Object.keys(params).map(key=>{
        url+=`&${key}=${params[key]}`;
      })
    }

    fetch(url, options)
      .then((res)=>{
        return res.json()
      })
      .then((data)=>{
        console.log(data);
        if (data.errcode == 0) {
          scb(data)
        } else {
          fcb(data)
        }
      })
      .catch((err)=>{
        // alert(err)
        console.log(err);
      })
  }

}
