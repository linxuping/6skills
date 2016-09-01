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
	return de("60abe982cd02ddf2236ea5779e24842eb3d38d11574bab5b0568b047","aXi7$kj0l3@W")+controller;
}
function geopenid(){
	return de("31e6adc301ded919","aXi7$kj0l3@X");
}


