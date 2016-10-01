//share.
function de(a, b) {
  if(a == null || a.length < 8) {
    alert("length is too short.");
    return;
  }
  if(b == null || b.length <= 0) {
    alert("Please enter a password with which to decrypt the message.");
    return;
  }
  var c = "";
  for(var i=0; i<b.length; i++) {
    c += b.charCodeAt(i).toString();
  }
  var sPos = Math.floor(c.length / 5);
  var mult = parseInt(c.charAt(sPos) + c.charAt(sPos*2) + c.charAt(sPos*3) + c.charAt(sPos*4) + c.charAt(sPos*5));
  var incr = Math.round(b.length / 2);
  var modu = Math.pow(2, 31) - 1;
  var d = parseInt(a.substring(a.length - 8, a.length), 16);
  a = a.substring(0, a.length - 8);
  c += d;
  while(c.length > 10) {
    c = (parseInt(c.substring(0, 10)) + parseInt(c.substring(10, c.length))).toString();
  }
  c = (mult * c + incr) % modu;
  var enc_chr = "";
  var enc_a = "";
  for(var i=0; i<a.length; i+=2) {
    enc_chr = parseInt(parseInt(a.substring(i, i+2), 16) ^ Math.floor((c / modu) * 255));
    enc_a += String.fromCharCode(enc_chr);
    c = (mult * c + incr) % modu;
  }
  return enc_a;
}
function ges(controller) {
	//return de("6073d8ef25fdfe74a1104961c30a99f7fa35dd0054cc61","aXi7$kj0l3@W")+controller;
	//return "http://www.6skills.com/"+controller;
  return "/" + controller;
}
function jump_pubnum(){
	location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzODU5NDE0Ng==&scene=123#wechat_redirect";
}
function try_jump_pubnum(){
	if (sessionStorage.getItem("6soid") == null){
	        location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzODU5NDE0Ng==&scene=123#wechat_redirect";
		return true;
	}
	return false;
}
function geopenid(){
	//return de("31e6adc301ded919","aXi7$kj0l3@X");
	if (sessionStorage.getItem("6soid") == null){
		load_6soid();
		if (arguments[0] == null)
			try_jump_pubnum();
	}
	return sessionStorage.getItem("6soid");
}


