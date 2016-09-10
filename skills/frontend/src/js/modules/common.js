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
				sessionStorage.setItem("6soid",res.openid);
			},
			error: function() {
				alert("请稍后再试-6id.");
			},
		});
	}
}
window.onload = load_6soid;


