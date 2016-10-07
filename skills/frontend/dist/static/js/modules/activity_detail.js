var ActivityDetail = React.createClass({displayName: "ActivityDetail",
	getInitialState: function() {
		return {
			activity: {},
			imgs: {},
			loaded: false
		};
	},

	openSignPage: function(){
		var _oid = geopenid();
		if ("undefined" == _oid || null == _oid){
			var r = confirm("请先关注公众号再查看.");
			if (r)
				jump_pubnum();
			return;
		}
		if (this.state.expire) {
			alert("该活动已经过期！")
		}
		else if (this.state.status == 1) {
			window.location = "#qrcode";
			alert("您已经报过名了，请到已报名活动中查看！")
		} else if (this.state.status == 2) {
			//付款
			//TODO 阳光下成长还要返回报名科目
			var major = "书画";
			document.title = "付款";
			ReactDOM.render(
				React.createElement(Pay, {backTitle: "活动详情", major: major, 
					activity: this.state.activity}),
				document.getElementById('pay-page-wrap')
			);
		} else {
			var actid = getUrlParam("actid");
			if (sessionStorage.getItem("_remains_" + actid) == 0) {
				alert("活动人数已满，无法报名");
				return;
			}

			profile = sessionStorage.getItem("_profile");
			if (profile == null){
				$.ajax({
					url: ges('activities/get_profile'),
					//url: "/test/get_profile.json",
					type: 'get',
					dataType: 'json',
					async: false,
					data: { "openid": geopenid() }
				})
				.done(function(res) {
					console.log("success");
					if (res.errcode == 0) {
						sessionStorage.setItem("_profile", JSON.stringify(res.profile));
					}
				}.bind(this))
				.fail(function() {
					console.log("error");
				});
			}
			verify = true;
			profile = sessionStorage.getItem("_profile");
			if (profile) {
				profile = JSON.parse(profile);
				if (profile.phone==null || profile.phone=="")
					verify = false;
			} else { verify=false; }
			if (!verify) {
				location.href=ges("template/verify_phone.html");
				return;
			}

			document.title = "活动报名";
			ReactDOM.render(
				React.createElement(Sign, {actid: actid, backTitle: "活动详情", reload: this.getSignupStatus, 
					activity: this.state.activity}),
				document.getElementById('sign-page-wrap')
			);
		 }
	},

	openCollectPage: function(){
		var _oid = geopenid();
		if ("undefined" == _oid || null == _oid){
			var r = confirm("请先关注公众号再查看.");
			if (r)
				jump_pubnum();
			return;
		}
		if (this.state.coll_status) {
			alert("已收藏该活动，请到我的收藏中查看！");
			return;
		}
		//check if no Pay attention to the public number.
		//turn to page 'attention'
		$.ajax({
			url: ges('activities/collect'),
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":geopenid(),"actid": this.props.actid },
		})
		.done(function(res) {
			if (res.errcode != 0){
				alert(res.errmsg);
				return;
			}
			$(".sign-btn")[0].innerHTML = "已收藏";
		}.bind(this))
		.fail(function() {
			console.log("collect error");
		})
		.always(function() {
			console.log("complete");
		});
	},

	getSignupStatus: function(){
		var url = ges('activities/get_signup_status');
		//var url = "/test/get_signup_status.json";
		$.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {openid: geopenid("ignore"), actid: actid},
		})
		.done(function(res) {
			console.log(res);
			this.setState({
				status: res.status,
				expire: res.errmsg=="过期",
				coll_status: res.coll_status,
				qrcode: res.qrcode,
				loaded: true
			});
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	},

	componentDidMount: function() {
		var actid = getUrlParam("actid");
		if (!IsNum(actid)){
			alert("actid must be number.");
			return;
		}
		_encodeurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe6d40d1e6b8d010e&redirect_uri="+encodeURIComponent(window.location.href)+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
		
		//获取活动具体信息
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
			data: { "actid":actid,"openid":geopenid("ignore") },
			success: function(res) {
				$.ajax({
					url: ges("get_js_signature"),
					type: 'get',
					dataType: 'json',
					data: { "url":window.location.href },//ges("template/activity_detail.html?actid="+res.actid)
					success: function(res2) {
						if (res2.appid != null){
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: res2.appid, // 必填，公众号的唯一标识
								timestamp: res2.timestamp, // 必填，生成签名的时间戳
								nonceStr: res2.noncestr, // 必填，生成签名的随机串
								signature: res2.signature,// 必填，签名，见附录1
								jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
							});
							String.prototype.stripHTML = function() {
								var reTag = /<(?:.|\s)*?>/g;
								var reTag2 = /&nbsp/g;
								var reTag3 = /&.*;/g;
								var reTag4 = / /g;
								return this.replace(reTag,"").replace(reTag2,"").replace(reTag3,",").replace(reTag4,"");
							}
							var _content = res.content.substring(0, 100).stripHTML();
							wx.ready(function(){
								make_share("all",res.title,_content,_encodeurl,res.img_cover,null);
							});
							wx.error(function(res2){
								if (sessionStorage.getItem("6soid") != null)
									alert('微信错误提示: '+JSON.stringify(res2));
							});
						}
					},
					error: function() {
						alert("请稍后重试获取签名.");
					},
				});

				this.setState({
					activity: res,
					signtype: res.sign_type || 1,
					imgs: res.imgs,
				});
				
				if (res.sign_type == 3) {
					var uploadJs = [
						'/static/js/upload/moxie.min.js', '/static/js/upload/plupload.js', 
						'/static/js/upload/qiniu.min.js', '/static/js/upload/upload-config.js', 
						'/static/js/modules/upload.js'];
					for (var i = 0; i < uploadJs.length; i++) {
						var js = document.createElement("script");
						js.async = false;
						js.src = uploadJs[i];
						document.body.appendChild(js);
					}
				}
				// if (res.price_child == 0) {
				// 	var js = document.createElement("script");
				// 	js.async = false;
				// 	js.src = "/static/js/modules/pay.js";
				// 	document.body.appendChild(js);
				// }

			}.bind(this),
			error: function() {
				this.setState({
					activity: {}
				});
				console.log("get actid error.");
			}.bind(this),
		});

		this.getSignupStatus();
	},

	backHandler: function(){
		history.back();
	},

	render: function() {
		console.log(this.state.activity)
		return (
			React.createElement("div", {className: "activity-detail"}, 
				/*<Pay activity={this.state.activity}></Pay>*/
				React.createElement("div", {className: "back-btn", onClick: this.backHandler}, "活动详情"), 
				React.createElement("article", {className: "media"}, 
					React.createElement("div", {className: "media-hd", ref: "coverBox"}, 
						React.createElement("img", {src: this.state.activity.img_cover, alt: ""})
					), 
					React.createElement("div", {className: "weui_panel header-msg"}, 
						React.createElement("div", {className: "weui_panel_bd "}, 
							React.createElement("h4", {className: "title"}, this.state.activity.title), 

							React.createElement("div", {className: "money clearfix ot-msg"}, 
								
									(this.state.activity.price_child_pre==null)? ""
										:
										React.createElement("span", {className: "now fl"}, "现价：", React.createElement("span", {className: "cost"}, "￥", this.state.activity.price_child_pre, "元")), 
									
								React.createElement("span", {className: (this.state.activity.price_child_pre!=null) ? "original fr has-pre" : "original"}, 
									this.state.activity.price_child_pre != null ? "原价" : "价格", "：", 
									React.createElement("span", {className: "cost"}, 
										this.state.activity.price_child == 0 ? "免费" :
											React.createElement("span", null, "￥", this.state.activity.price_child, "元")
									)
								)
							), 

							/*<p className="privilage"><b>{this.state.activity.preinfo}</b></p>*/
							React.createElement("div", {className: "ot-msg"}, React.createElement("span", null, "年龄：", this.state.activity.ages, "岁")), 
							React.createElement("div", {className: "ot-msg"}, "活动时间: ", this.state.activity.time_from, " ~ ", this.state.activity.time_to), 
							React.createElement("div", {className: "ot-msg"}, "活动地点：", this.state.activity.area, " ", this.state.activity.position_details), 
							React.createElement("div", {className: "ot-msg"}, "剩余名额：", (this.state.activity.quantities_remain>1000000) ? "不限":React.createElement("font", null, this.state.activity.quantities_remain))
						)
					), 

					React.createElement("div", {className: "weui_panel", style: {marginTop: "10px", padding:"20px 10px"}}, 
						React.createElement("div", {className: "weui_panel_bd detail-content", dangerouslySetInnerHTML: {__html: this.state.activity.content}}
						)
					), 
						
							this.state.status && this.state.qrcode ?
								React.createElement(QrCode, {qrcode: this.state.qrcode}) : ""
						
				), 
				React.createElement("div", {className: "sign-btn", style: {"cursor": "pointer"}, 
					onClick: this.openCollectPage}, 
					
						this.state.coll_status ? "已收藏" : "收藏"
					
				), 
				React.createElement("div", {className: "sign-btn-right", style: {"cursor": "pointer"}, 
					onClick: this.openSignPage}, 
					
						this.state.expire ? "已过期" : 
							(this.state.status == 1 ? "已报名" : 
								(this.state.status == 2 ? "付款" : "我要报名"))
					

				), 
				React.createElement("div", {id: "sign-page-wrap"})
			)
		);
	}
});

var QrCode = React.createClass({displayName: "QrCode",
	render: function() {
		return (
			React.createElement("div", {className: "QrCode", id: "qrcode"}, 
				React.createElement("div", {className: "qrcode-box"}, 
					React.createElement("div", {className: "tip"}, 
						React.createElement("img", {src: this.props.qrcode, alt: ""}), 
						React.createElement("p", null, "长按二维码加入活动微信群")
					)
				)
			)
		);
	}
});

