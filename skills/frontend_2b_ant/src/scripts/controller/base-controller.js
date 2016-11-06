import {notification} from 'antd';

export default class BaseController {

  constructor(props) {
    this.domain = "";
  }

  get(url, params, success, fail, error, always, async = true){
    url = this.preRequest(url);
    $.ajax({
      url: url,
      type: 'get',
      async: async,
      dataType: 'json',
      data: params,
    })
    .done(function(res) {
      if (res.errcode == 0) {
        success(res);
      } else {
        notification['error']({
          message: '提示！',
          description: res.errmsg,
          duration: 5
        });
      }
    })
    .fail(function(xmlHttpRequest, errText) {
      console.log(errText);
      error ?
        error() :
        notification['error']({
          message: '出错啦！',
          description: '服务出错！请稍后重试！',
          duration: 5
        });;
    })
    .always(function() {
      console.log("complete");
      always && always();
    });
  }

  post(url, params, success, fail, error, always) {
    url = this.preRequest(url);
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      data: params,
    })
    .done(function(res) {
      if (res.errcode == 0) {
        success(res);
      } else {
        notification['error']({
          message: '提示！',
          description: res.errmsg,
          duration: 5
        });
      }
    })
    .fail(function() {
      error ?
        error() :
        notification['error']({
          message: '出错啦！',
          description: '服务出错！请稍后重试！',
          duration: 5
        });;
    })
    .always(function() {
      console.log("complete");
      always && always();
    });
  }

  preRequest(url) {
    return this.domain + url;
  }

}
