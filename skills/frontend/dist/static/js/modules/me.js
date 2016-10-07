var Me = React.createClass({displayName: "Me",
	getInitialState: function() {
		return {
			username: "",
			phone: "",
			img: "",
		};
	},
	componentDidMount: function(){
		this.handlerRoute();
		$.ajax({
			url: ges('activities/get_profile'),
			type: 'get',
			dataType: 'json',
			data: { "openid":geopenid() },
		})
		.done(function(res) {
			console.log("success");
			console.log(res.profile.username);
			console.log(res.profile.img);
			if (res.errcode != 0){
				//location.href=ges("template/verify_phone.html");
				return;
			}
			this.setState( { "username":res.profile.username,"phone":res.profile.phone,"img":res.profile.img } );
		}.bind(this))
		.fail(function() {
			console.log("fail");
		});
	},

	handlerRoute: function(){
		var hash = window.location.href.split("#")[1];
		if (hash !== undefined) {
			if ("myactivities".indexOf(hash) !== -1) {
				this.gotoMyActivities();
			} else if ("collections".indexOf(hash) !== -1) {
				this.gotoMyCollections();
			} else if ("activities-to-pay".indexOf(hash) !== -1) {
				this.gotoNotPayActivities();
			}
		}
	},

	back: function(){
		ReactDOM.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
		document.title = "我";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href);
	},
	gotoActivityDetail: function(activity){
		window.location = "activity_detail.html?actid=" + activity.actid
	},
	gotoFeedback: function(){
		document.title = "联系我们";
		ReactDOM.render(
			React.createElement(Feedback, {back: this.back}),
			document.getElementById("sign-page-wrap")
		);
	},

	gotoMyActivities: function(){
		document.title = "已报名课程";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href + "#myactivities");
		ReactDOM.render(
			React.createElement(MyActivities, {back: this.back, gotoActivityDetail: this.gotoActivityDetail}),
			document.getElementById("sign-page-wrap")
		);
	},
	gotoMyCollections: function () {
		document.title = "我的收藏";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href + "#collections");
		ReactDOM.render(
			React.createElement(MyCollections, {back: this.back, gotoActivityDetail: this.gotoActivityDetail}),
			document.getElementById("sign-page-wrap")
		);
	},
	
	gotoNotPayActivities: function() {
	  document.title = "待付款";
	  var href = window.location.href.split("#")[0];
	  history.replaceState("myActivities", null, href + "#activities-to-pay");
	  ReactDOM.render(
	  	React.createElement(ActivitiesToPay, {back: this.back, gotoActivityDetail: this.gotoActivityDetail}),
	  	document.getElementById("sign-page-wrap")
	  );
	},

	render: function() {
		return (
			React.createElement("div", {className: "me"}, 
				React.createElement("div", {className: "cell"}, 
					React.createElement("div", {className: "hd tc"}, 
						React.createElement("img", {src: this.state.img, alt: ""}), 
						React.createElement("p", {className: "name"}, this.state.username)
					), 
					React.createElement("div", {className: "bd"}, 
						React.createElement("div", {className: "weui_cells weui_cells_access"}, 
							React.createElement("a", {href: "javascript:void(0);", className: "weui_cell", 
								 onClick: this.gotoMyActivities}, 
								React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "已报名课程")
								), 
								React.createElement("div", {className: "weui_cell_ft"})
							), 

							React.createElement("a", {href: "javascript:void(0);", className: "weui_cell", 
								 onClick: this.gotoMyCollections}, 
								React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "我的收藏")
								), 
								React.createElement("div", {className: "weui_cell_ft"})
							), 

							React.createElement("a", {href: "javascript:void(0);", className: "weui_cell", 
								 onClick: this.gotoNotPayActivities}, 
								React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "待付款")
								), 
								React.createElement("div", {className: "weui_cell_ft"})
							)

						)
					)
				), 
				React.createElement("div", {id: "sign-page-wrap"})
			)
		);
	}
});
/*
							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoFeedback}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>联系我们</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>
			<div className="feedback sign-page">
*/

//FIXED ME
var Feedback = React.createClass({displayName: "Feedback",
	render: function() {
		return (
			React.createElement("div", {className: "feedback"}, 
				(this.props.onlyContact=="1") ? React.createElement("div", null):React.createElement("div", {className: "back-btn", onClick: this.props.back}, "返回"), 
				React.createElement("h3", null, "转载文章"), 
				React.createElement("p", null, "转载文章请在文中附下图，即视为有效制授权，无需再联系我们"), 
				React.createElement("p", {className: "qr"}, 
					React.createElement("img", {src: "/static/img/qrcode_for_gh_1f700e3515dc_258.jpg", alt: ""})
				), 
				React.createElement("h3", null, "在线客服"), 
				React.createElement("p", {className: "ol-serv"}, 
					"点击咨询在线客服", 
					React.createElement("a", {target: "_blank", href: "http://sighttp.qq.com/authd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb"}, React.createElement("img", {border: "0", src: "http://wpa.qq.com/imgd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb&pic=52", alt: "点击这里给我发消息", title: "点击这里给我发消息"}))
				), 
				React.createElement("h3", null, "其他合作"), 
				React.createElement("p", null, 
					"邮箱：", React.createElement("mail", null, "1344671651@qq.com")
				)
			)
		);
	}
});

var MyActivities = React.createClass({displayName: "MyActivities",
	getInitialState: function() {
		return {
			activities: []
		};
	},
	signReset: function(ev){
		ev.stopPropagation();
		this.setState({
			signidWantToReset: ev.target.dataset.signid
		});
		ReactDOM.render(
			React.createElement(ConfirmDialog, {callback: this.confirmReset, title: "取消报名", 
				content: "您确定要取消该课程的报名吗？"}),
			document.getElementById("confirm-dialog-wrap")
		);
	},
	confirmReset: function (argument) {
		$.ajax({
			url: ges('activities/reset'),
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":geopenid(),"signid": this.state.signidWantToReset },
		})
		.done(function() {
			console.log("success");
			console.log("取消报名成功")
			this.pullFromServer();
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
		});
	},

	componentDidMount: function() {
	 	this.pullFromServer();
	},
	pullFromServer:function(){
		$.ajax({
			url: ges('activities/my'),
			//url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
			success: function(res) {
				console.log("success");
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("error");
			}.bind(this)
		});
	},
	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					React.createElement("li", {onClick: this.props.gotoActivityDetail.bind(this, elem), 
						style: {"cursor": "pointer"}, "data-actid": elem.actid}, 
						React.createElement("header", {className: "ss-hd"}, elem.title), 
						React.createElement("p", {className: "time clearfix"}, 
							React.createElement("span", null, "课程时间"), React.createElement("time", null, elem.time_act)
						), 
						React.createElement("div", {className: "time clearfix"}, 
							React.createElement("span", null, "报名时间"), React.createElement("time", null, elem.time_signup)
						), 
						React.createElement("button", {type: "button", onClick: this.signReset, 
							"data-uid": index, "data-signid": elem.signid, className: "weui_btn weui_btn_mini weui_btn_default"}, 
							"取消"
						)
					)
				);
			}.bind(this));
		return (
			React.createElement("div", {className: "myActivities sign-page", style: {"overflow": "auto"}}, 
				React.createElement("div", {className: "back-btn", onClick: this.props.back}, "返回"), 
				React.createElement("div", {className: "cell"}, 
					React.createElement("ul", {className: "my-activities"}, 
						myActivitiesStr
					), 
					React.createElement("div", {id: "confirm-dialog-wrap"})
				)
			)
		);
	}
});

var MyCollections = React.createClass({displayName: "MyCollections",
	getInitialState: function() {
		return {
			activities: []
		};
	},
	componentDidMount: function() {
		this.pullFromServer();
	},
	pullFromServer: function() {
		$.ajax({
			url: ges('activities/mycollections'),
			//url: '/static/js/test/list.js',
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
			success: function(res) {
				console.log("mycollections success");
				res = JSON.parse(res)
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("mycollections error");
			}.bind(this)
		});
	},

	delCollectionHandler: function (event) {
		var _this = this;
		event.stopPropagation();
		var collid = event.target.dataset.collid;
		ReactDOM.render(
			React.createElement(ConfirmDialog, {callback: function(){
					$.ajax({
						url: ges('activities/reset_collection'),
						//url: '/test/sign.json',
						type: 'post',
						dataType: 'json',
						data: { "openid":geopenid(),"collid": collid },
					})
					.done(function() {
						this.pullFromServer();
					}.bind(this))
					.fail(function() {
						console.log("delCollection error");
					})
					.always(function() {
						console.log("delCollection complete");
						ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
					});
				}.bind(this), title: "删除收藏", 
				content: "您确定要删除这个收藏吗？"}),
			document.getElementById("confirm-dialog-wrap")
		);
	},

	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					React.createElement("li", {onClick: this.props.gotoActivityDetail.bind(this, elem), 
						style: {"cursor": "pointer"}, "data-actid": elem.actid}, 
						React.createElement("header", {className: "ss-hd"}, elem.title), 
						React.createElement("p", {className: "time clearfix"}, 
							React.createElement("span", null, "课程时间"), React.createElement("time", null, elem.time_act)
						), 
						React.createElement("button", {type: "button", onClick: this.delCollectionHandler, 
							"data-uid": index, "data-collid": elem.collid, className: "weui_btn weui_btn_mini weui_btn_default"}, 
							"删除"
						)
					)
				);
			}.bind(this));
		return (
			React.createElement("div", {className: "myActivities sign-page", style: {"overflow": "auto"}}, 
				React.createElement("div", {className: "back-btn", onClick: this.props.back}, "返回"), 
				React.createElement("div", {className: "cell"}, 
					React.createElement("ul", {className: "my-activities"}, 
						myActivitiesStr
					), 
					React.createElement("div", {id: "confirm-dialog-wrap"})
				)
			)
		);
	}
});

var ActivitiesToPay = React.createClass({displayName: "ActivitiesToPay",
	getInitialState: function() {
		return {
			activities: []
		};
	},
	componentDidMount: function() {
		this.pullFromServer();
	},
	pullFromServer: function() {
		$.ajax({
			url: '/activities/unpay/list',
			//url: "/static/js/test/list.js",
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
			success: function(res) {
				console.log("unpay list success");
				res = JSON.parse(res);
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("unpay list error");
			}.bind(this)
		});
	},

	// delCollectionHandler: function (event) {
	// 	event.stopPropagation();
	// 	var collid = event.target.dataset.collid;
	// 	ReactDOM.render(
	// 		<ConfirmDialog callback={function(){
	// 				$.ajax({
	// 					url: ges('/activities/reset_collection'),
	// 					//url: '/test/sign.json',
	// 					type: 'post',
	// 					dataType: 'json',
	// 					data: { "openid":geopenid(),"collid": collid },
	// 				})
	// 				.done(function() {
	// 					this.pullFromServer();
	// 				}.bind(this))
	// 				.fail(function() {
	// 					console.log("delCollection error");
	// 				})
	// 				.always(function() {
	// 					console.log("delCollection complete");
	// 					ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
	// 				});
	// 			}.bind(this)} title="删除收藏"
	// 			content="您确定要删除这个收藏吗？"/>,
	// 		document.getElementById("confirm-dialog-wrap")
	// 	);
	// },

	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					React.createElement("li", {onClick: this.props.gotoActivityDetail.bind(this, elem), 
						style: {"cursor": "pointer"}, "data-actid": elem.actid}, 
						React.createElement("header", {className: "ss-hd"}, elem.title), 
						React.createElement("p", {className: "time clearfix"}, 
							React.createElement("span", null, "课程时间"), React.createElement("time", null, elem.time_signup)
						)
						/*<button type="button" onClick={this.delCollectionHandler}
													data-uid={index} data-collid={elem.collid} className="weui_btn weui_btn_mini weui_btn_default">
													付款
												</button>*/
					)
				);
			}.bind(this));
		return (
			React.createElement("div", {className: "myActivities sign-page", style: {"overflow": "auto"}}, 
				React.createElement("div", {className: "back-btn", onClick: this.props.back}, "返回"), 
				React.createElement("div", {className: "cell"}, 
					React.createElement("ul", {className: "my-activities"}, 
						myActivitiesStr
					), 
					React.createElement("div", {id: "confirm-dialog-wrap"})
				)
			)
		);
	}
});


var ConfirmDialog = React.createClass({displayName: "ConfirmDialog",
	reset: function(){
		ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
	},
	render: function() {
		return (
			React.createElement("div", {className: "weui_dialog_confirm", id: "confirm-dialog"}, 
		    React.createElement("div", {className: "weui_mask"}), 
		    React.createElement("div", {className: "weui_dialog"}, 
	        React.createElement("div", {className: "weui_dialog_hd"}, 
	        	React.createElement("strong", {className: "weui_dialog_title"}, this.props.title || "提示")
	        ), 
	        React.createElement("div", {className: "weui_dialog_bd"}, 
	        this.props.content
	        ), 
	        React.createElement("div", {className: "weui_dialog_ft"}, 
	            React.createElement("a", {href: "javascript:;", className: "weui_btn_dialog default", 
	               onClick: this.reset}, "取消"), 
	            React.createElement("a", {href: "javascript:;", className: "weui_btn_dialog primary", 
	            	onClick: this.props.callback}, 
	            	"确定")
	        )
		    )
			)
		);
	}
});
