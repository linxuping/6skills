var ActivityDetail = React.createClass({
	getInitialState: function() {
		return {
			activity: {},
			imgs: {},
			loaded: false
		};
	},

	openSignPage: function(){
		if (this.state.status) {
			window.location = "#qrcode";
			alert("您已经报过名了，请到已报名活动中查看！")
		} else {
			var actid = getUrlParam("actid");
			if (sessionStorage.getItem("_remains_" + actid) == 0) {
				alert("活动人数已满，无法报名");
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
		.done(function() {
			$(".sign-btn")[0].innerHTML = "已收藏";$
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
			data: {openid: geopenid(), actid: actid},
		})
		.done(function(res) {
			this.setState({
				status: res.status,
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
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
			data: { "actid":actid,"openid":geopenid() },
			success: function(res) {
				console.log(res);
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
						<p className="area">活动地点：{this.state.activity.area}</p>
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
						this.state.status ? "已报名" : "我要报名"
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
