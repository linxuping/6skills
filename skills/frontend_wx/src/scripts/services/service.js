import "whatwg-fetch"

export default class BaseService {

  constructor(){
    this.openid = "";
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
      options.body = JSON.stringify(params)
    } else if(method=="get" && params != null) {
      //get method

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
          fcb(xmlHttpRequest.text)
        }
      })
      .catch((err)=>{
        // alert(err)
        console.log(err);
      })
  }

}
