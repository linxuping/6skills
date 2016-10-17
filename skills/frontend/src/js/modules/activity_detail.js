var ActivityDetail = React.createClass({
	getInitialState: function() {
		return {
			activity: {},
			imgs: {},
			loaded: false
		};
	},

	openSignPage: function(){
		var _oid = geopenid(1);
		if ("undefined" == _oid || null == _oid){
			var r = confirm("请先关注公众号再查看.");
			if (r == true)
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
			document.title = "付款";
			ReactDOM.render(
				<Pay backTitle="活动详情" major={this.state.major} 
					activity={this.state.activity} price={this.state.price}/>,
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
				<Sign actid={actid} backTitle="活动详情" reload={this.getSignupStatus} 
					activity={this.state.activity}/>,
				document.getElementById('sign-page-wrap')
			);
		 }
	},

	openCollectPage: function(){
		var _oid = geopenid(1);
		if ("undefined" == _oid || null == _oid){
			var r = confirm("请先关注公众号再查看.");
			if (r == true)
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
				price: res.price,
				major: res.major,
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
		// alert(devicePixelRatio);
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
					//data: { "url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe6d40d1e6b8d010e&redirect_uri=http%3A%2F%2Fwww.6skills.com%2Ftemplate%2Factivity_detail.html%3Factid%3D"+actid.toString()+"&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect" },//{ "url":window.location.href },//ges("template/activity_detail.html?actid="+res.actid)
					//data: { "url":encodeURIComponent(location.href.split('#')[0]) },//ges("template/activity_detail.html?actid="+res.actid)
					data: { "url":location.href.split('#')[0] },//ges("template/activity_detail.html?actid="+res.actid)
					//data: { "url":window.location.href },//ges("template/activity_detail.html?actid="+res.actid)
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
							var _content = res.content_share;
							if (_content=="" && _content==null)
								_content = res.content.substring(0, 100).stripHTML();
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
						;//alert("请稍后重试获取签名.");
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
		var hid_price = this.state.activity.actid==90;
		return (
			<div className="activity-detail">
				{/*<Pay activity={this.state.activity}></Pay>*/}
				<div className="back-btn" onClick={this.backHandler}>活动详情</div>
				<article className="media">
					<div className="media-hd" ref="coverBox">
						<img src={this.state.activity.img_cover} alt=""/>
					</div>
					<div className="weui_panel header-msg">
						<div className="weui_panel_bd " >
							<h4 className="title">{this.state.activity.title}</h4>

							<div className="money clearfix ot-msg">
								{
									(this.state.activity.price_child_pre==null)? ""
										:
										<span className="now fl">现价：<span className="cost">￥{this.state.activity.price_child_pre}元</span></span>
									}
								<span className={(this.state.activity.price_child_pre!=null) ? "original fr has-pre" : "original"} style={{display: hid_price && "none"}}>
									{this.state.activity.price_child_pre != null ? "原价" : "价格"}：
									<span className="cost">
										{this.state.activity.price_child == 0 ? "免费" :
											<span>￥{this.state.activity.price_child}元</span>}
									</span>
								</span>
							</div>

							{/*<p className="privilage"><b>{this.state.activity.preinfo}</b></p>*/}
							<div className="ot-msg"><span>年龄：{this.state.activity.ages}岁</span></div>
							<div className="ot-msg">活动时间：{this.state.activity.time_from} ~ {this.state.activity.time_to}</div>
							<div className="ot-msg">活动地点：{this.state.activity.area} {this.state.activity.position_details}</div>
							<div className="ot-msg">剩余名额：{(this.state.activity.quantities_remain>1000000) ? "不限":<font>{this.state.activity.quantities_remain}</font>}</div>
						</div>
					</div>

					<div className="weui_panel" style={{marginTop: "10px", padding:"20px 10px"}}>
						<div className="weui_panel_bd detail-content" dangerouslySetInnerHTML={{__html: this.state.activity.content}}>
						</div>
					</div>
						{
							this.state.status && this.state.qrcode ?
								<QrCode qrcode={this.state.qrcode}/> : ""
						}
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
						this.state.expire ? "已过期" : 
							(this.state.status == 1 ? "已报名" : 
								(this.state.status == 2 ? "付款" : "我要报名"))
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

