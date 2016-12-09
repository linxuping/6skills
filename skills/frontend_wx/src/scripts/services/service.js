import "whatwg-fetch"
import utils from '../common/utils';
import { alert } from '../common/dialog.jsx';

export default class BaseService {

  constructor(){
    this.openid = utils && utils.getopenid();
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
      .then((res, err)=>{
        if (res.ok) {
          return res.json()
        } else {
          return {errcode: res.status, errmsg: `${res.status}-${res.statusText}`}
        }
      })
      .then((data)=>{
        console.log(data);
        if (data.errcode == 0) {
          scb && scb(data)
        } else {
          if (fcb) {
            fcb(data)
          } else {
            alert({
              content: data.errmsg,
              title: "错误"
            })
          }
        }
      })
      .catch((err)=>{
        // alert(err)
        console.log(err);
      })
  }

}
