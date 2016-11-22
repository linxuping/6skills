class Utils {
  constructor() {

  }

  getSearch (href) {
    href = href || win.location.search;
    var data = {},reg = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
    href && href.replace(reg,function( $0, $1, $2, $3 ){
      data[ $1 ] = $3;
    });
    return data;
  }

  getopenid(){
    if (true) {
      return "oYgYJwXWP9vbAVtIGWYJ5TDGky5A";
    }
    if (sessionStorage.getItem("6soid") == null){
  		load_6soid();
  		if (arguments[0] == null)
  			try_jump_pubnum();
  	}
  	return sessionStorage.getItem("6soid");
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

}

export default new Utils();
