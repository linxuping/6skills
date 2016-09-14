//common methods.
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
function IsNum(s)
{
	if(s!=null){
		var r,re;
		re = /\d*/i; //\d表示数字,*表示匹配多个数字
		r = s.match(re);
		return (r==s)?true:false;
	}
	return false;
}

//geo.
//<script charset="utf-8" src="http://map.qq.com/api/js?v=2.exp"></script>
function codeLatLng(lat, lng) {
	var geocoder,map, marker = null;
	//var input = document.getElementById("latLng").value;
	//var latlngStr = input.split(",",2);
	//var lat = parseFloat(latlngStr[0]);
	//var lng = parseFloat(latlngStr[1]);
	var latLng = new qq.maps.LatLng(lat, lng);

	//var center = new qq.maps.LatLng(39.916527,116.397128);
	//var center = new qq.maps.LatLng(lat, lng);
	geocoder = new qq.maps.Geocoder({
		complete : function(result){
			console.log(result.detail.addressComponents);
		}
	});	

	//调用获取位置方法
	geocoder.getAddress(latLng);
}

function get_area() {
	return "天河区";
}

function load_6soid() {
	if (sessionStorage.getItem("6soid")){
		return;
	}
	if (getUrlParam("code")!=null && getUrlParam("state")!=null){
		$.ajax({
			url: ges("get_6sid"),
			type: 'get',
			dataType: 'json',
			async: false,
			data: { "code":getUrlParam("code") },
			success: function(res) {
				if (res.errcode == 0)
					sessionStorage.setItem("6soid",res.openid);
			},
			error: function() {
				alert("请稍后再试-6id.");
			},
		});
	}
}
window.onload = load_6soid;

function init_share(_url){
	$.ajax({
		url: ges("get_js_signature"),
		type: 'get',
		dataType: 'json',
		data: { "url":_url },
		success: function(res) {
			alert(res.signature);
			if (res.appid != null){
				wx.config({
					debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: res.appid, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.noncestr, // 必填，生成签名的随机串
					signature: res.signature,// 必填，签名，见附录1
					jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			}
		},
		error: function() {
			alert("请稍后重试获取签名.");
		},
	});

	/*
	wx.ready(function(){
		alert("ready");
	});
	wx.error(function(res){
		alert(res.errMsg);
	}) */;
}

function make_share(sharetype,title,desc,link,imgurl,type,dataurl){
	if (sharetype=="wx_timeline" || sharetype=="all"){
		wx.onMenuShareTimeline({
			title: title, // 分享标题
			link: link, // 分享链接
			imgUrl: imgurl, // 分享图标
			success: function () { 
				;//alert("成功分享到朋友圈!");// 用户确认分享后执行的回调函数
			},
			cancel: function () { 
				;//alert("取消分享到朋友圈!");// 用户取消分享后执行的回调函数
			}
		});
	}
	if (sharetype == "wx_appmsg" || sharetype=="all"){
		wx.onMenuShareAppMessage({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接
			imgUrl: imgurl, // 分享图标
			type: type, // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function () { 
				;//alert("成功分享给朋友!");// 用户确认分享后执行的回调函数
			},
			cancel: function () { 
				;//alert("取消分享给朋友!");// 用户取消分享后执行的回调函数
			}
		});
	}
	if (sharetype == "wx_qq" || sharetype=="all"){
		wx.onMenuShareQQ({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接
			imgUrl: imgurl, // 分享图标
			success: function () { 
				;// 用户确认分享后执行的回调函数
			},
			cancel: function () { 
				;// 用户取消分享后执行的回调函数
			}
		});
	}
	if (sharetype == "wx_weibo" || sharetype=="all"){
		wx.onMenuShareWeibo({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接
			imgUrl: imgurl, // 分享图标
			success: function () { 
				;// 用户确认分享后执行的回调函数
			},
			cancel: function () { 
				;// 用户取消分享后执行的回调函数
			}
		});
	}
	if (sharetype == "wx_qzone" || sharetype=="all"){
		wx.onMenuShareQZone({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接
			imgUrl: imgurl, // 分享图标
			success: function () { 
				;// 用户确认分享后执行的回调函数
			},
			cancel: function () { 
				;// 用户取消分享后执行的回调函数
			}
		});
	}
}

