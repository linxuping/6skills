var ActivityDetail = React.createClass({displayName: "ActivityDetail",
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

	collectPage: function(){
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
			React.createElement("div", {className: "activity-detail"}, 
				React.createElement("article", {className: "media"}, 
					React.createElement("div", {className: "media-hd"}, 
						React.createElement("img", {src: this.state.activity.img_cover, alt: ""})
					), 
					React.createElement("h4", {className: "title"}, this.state.activity.title), 
					React.createElement("div", {className: "media-bd"}, 
						React.createElement("p", {className: "money clearfix"}, 
							(this.state.activity.price_child_pre==null)? "":React.createElement("span", {className: "now fl"}, "现价￥", this.state.activity.price_child_pre), 
							React.createElement("span", {className: "original fr"}, "￥", this.state.activity.price_child)
						), 
						React.createElement("p", {className: "privilage"}, React.createElement("b", null, this.state.activity.preinfo)), 
						React.createElement("p", {className: "age"}, this.state.activity.ages, "岁"), 
						React.createElement("p", {className: "time"}, "活动时间: ", this.state.activity.time_from, " ~ ", this.state.activity.time_to), 
						React.createElement("p", {className: "area"}, "活动地点：", this.state.activity.area), 
						React.createElement("p", {className: "detail-content", dangerouslySetInnerHTML: {__html: this.state.activity.content}}
						), 

						
							this.state.status && this.state.qrcode ?
								React.createElement(QrCode, {qrcode: this.state.qrcode}) : ""
						

					)
				), 
				React.createElement("div", {className: "sign-btn", style: {"cursor": "pointer"}, 
					onClick: this.collectPage}, 
					"收藏"
				), 
				React.createElement("div", {className: "sign-btn-right", style: {"cursor": "pointer"}, 
					onClick: this.openSignPage}, 
					
						this.state.status ? "已报名" : "我要报名"
					

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
