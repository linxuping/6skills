var ActivityDetail = React.createClass({
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
			var r = confirm("该分享已经过期，转到六艺互动公众号查看?");
			if (r)
				jump_pubnum();
			return;
		}
		if (this.state.expire) {
			alert("该活动已经过期！")
		}
		else if (this.state.status) {
			window.location = "#qrcode";
			alert("您已经报过名了，请到已报名活动中查看！")
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
			if (profile) {$
				profile = JSON.parse(profile);$
				if (profile.phone==null || profile.phone=="")
					verify = false;
			} else { verify=false; }$
			if (!verify) {
				location.href=ges("template/verify_phone.html");
				return;
			}
			
			document.title = "活动报名";
			ReactDOM.render(
				React.createElement(Sign, {actid: actid, backTitle: "活动详情", reload: this.getSignupStatus}),
				document.getElementById('sign-page-wrap')
			);
		}
	},

	openCollectPage: function(){
		var _oid = geopenid();
		if ("undefined" == _oid || null == _oid){
			var r = confirm("该分享已经过期，转到六艺互动公众号查看?");
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
		_encodeurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1cdf2c4bb014681e&redirect_uri="+encodeURIComponent(window.location.href)+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
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
					imgs: res.imgs,
				});
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
	render: function() {
		return (
			<div className="activity-detail">
				<article className="media">
					<div className="media-hd">
						<img src={this.state.activity.img_cover} alt=""/>
					</div>
					<h4 className="title">{this.state.activity.title}</h4>
					<div className="media-bd">
						<p className="money clearfix">
							{(this.state.activity.price_child_pre==null)? "":<span className="now fl">现价￥{this.state.activity.price_child_pre}</span>}
							<span className="original fr">￥{this.state.activity.price_child}</span>
						</p>
						<p className="privilage"><b>{this.state.activity.preinfo}</b></p>
						<p className="age">{this.state.activity.ages}岁</p>
						<p className="time">活动时间: {this.state.activity.time_from} ~ {this.state.activity.time_to}</p>
						<p className="area">活动地点：{this.state.activity.area} {this.state.activity.position_details}</p>
						<a href="http://weixin.qq.com/g/A9vt3M-8Ig-IJU53?from=message&isappinstalled=0">testlink.</a>
						<p className="detail-content" dangerouslySetInnerHTML={{__html: this.state.activity.content}}>
						</p>

						{
							this.state.status && this.state.qrcode ?
								<QrCode qrcode={this.state.qrcode}/> : ""
						}

					</div>
				</article>
				<div className="sign-btn" style={{"cursor": "pointer"}}
					onClick={this.openCollectPage}>
					{
						this.state.coll_status ? "已收藏" : "收藏"
					}
				</div>
				<div className="sign-btn-right" style={{"cursor": "pointer"}}
					onClick={this.openSignPage}>
					{
						this.state.expire ? "已过期" : (this.state.status ? "已报名" : "我要报名")
					}

				</div>
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});

var QrCode = React.createClass({
	render: function() {
		return (
			<div className="QrCode" id="qrcode">
				<div className="qrcode-box">
					<div className="tip">
						<img src={this.props.qrcode} alt=""/>
						<p>长按二维码加入活动微信群</p>
					</div>
				</div>
			</div>
		);
	}
});


