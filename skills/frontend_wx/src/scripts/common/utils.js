import Service from '../services/service';
let service = new Service();

class Utils {

  getSearch (href) {
    href = href || window.location.search;
    var data = {},reg = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
    href && href.replace(reg,function( $0, $1, $2, $3 ){
      data[ $1 ] = $3;
    });
    return data;
  }

  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var search = window.location.search || window.location.hash;
    var r = search.split("?")[1];
    if (r) {
      r = r.match(reg)
      return unescape(r[2]);
    } else {
      return null;
    }
  }

  getopenid(){
    // if (true) {
    //   return "oYgYJwXWP9vbAVtIGWYJ5TDGky5A";
    //   // return "oYgYJwcdR1mRcJ_3WLghpeTPJoKw"
    // }
    if (sessionStorage.getItem("6soid") == null){
      this.load_6soid();
    } else {
      return sessionStorage.getItem("6soid");
    }
  }

  /**
   * 获取openid
   */
  load_6soid(that) {
    if (sessionStorage.getItem("6soid")){
      return sessionStorage.getItem("6soid");
    }
    if (this.getUrlParam("code")!=null && this.getUrlParam("state")!=null) {
      service.fetch("/get_6sid", {code: this.getUrlParam("code")}, res=>{
        if (res.openid == null) {
          window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe6d40d1e6b8d010e&redirect_uri="+encodeURI(window.location.href)+"&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect";
        } else {
          sessionStorage.setItem("6soid",res.openid);
          if (that) {
            that.setState({loaded: true})
          }
        }
      }, (res)=>{
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe6d40d1e6b8d010e&redirect_uri="+encodeURI(window.location.href)+"&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect";
      })
    }
  }

  jump_pubnum(){
    location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzODU5NDE0Ng==&scene=123#wechat_redirect";
  }

  try_jump_pubnum(){
    if (sessionStorage.getItem("6soid") == null){
      location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzODU5NDE0Ng==&scene=123#wechat_redirect";
      return true;
    }
    return false;
  }

  url2json(url) {
    let arr = url.split("&");
    let res = {};
    for(var i = 0; i < arr.length; i++){
     res[arr[i].split('=')[0]] = decodeURIComponent(arr[i].split('=')[1]);
    }
    return res;
  }

}

export default new Utils();
