var Me = React.createClass({displayName: "Me",
	getInitialState: function() {
		return {
			username: "",
			phone: "",
			img: "",
		};
	},
	componentDidMount: function(){
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/get_profile',
			type: 'get',
			dataType: 'json',
			data: { "openid":'9901' },
		})
		.done(function(res) {
			console.log("success");
			console.log(res.profile.username);
			console.log(res.profile.img);
			if (res.errcode != 0){
				location.href="http://121.42.41.241:9900/template/verify_phone.html";
				return;
			}
			this.setState( { "username":res.profile.username,"phone":res.profile.phone,"img":res.profile.img } );
		}.bind(this))
		.fail(function() {
			console.log("fail");
		});
	},
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
		document.title = "我";
	},
	gotoFeedback: function(){
		document.title = "意见反馈";
		ReactDOM.render(
			React.createElement(Feedback, {back: this.back}), document.getElementById("sign-page-wrap")
		);
	},

	gotoMyActivities: function(){
		document.title = "已报名活动";
		ReactDOM.render(
			React.createElement(MyActivities, {back: this.back}), document.getElementById("sign-page-wrap")
		);
	},
	gotoMyCollections: function () {
		document.title = "我的收藏";
		ReactDOM.render(
			React.createElement(MyCollections, {back: this.back}),
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
									React.createElement("p", null, "已报名活动")
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
								 onClick: this.gotoFeedback}, 
								React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "意见反馈")
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

var Feedback = React.createClass({displayName: "Feedback",
	render: function() {
		return (
			React.createElement("div", {className: "feedback sign-page"}, 
				React.createElement("div", {className: "back-btn", onClick: this.props.back}, "返回"), 
				React.createElement("form", {action: "#"}, 

					React.createElement("input", {type: "hidden", name: "uid", value: ""}), 

					React.createElement("div", {className: "cell"}, 
						React.createElement("div", {className: "bd"}, 
							React.createElement("div", {className: "weui_cells weui_cells_form"}, 
								React.createElement("div", {className: "weui_cell"}, 
									React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
										React.createElement("textarea", {name: "feedback", id: "feedback", rows: "4", className: "weui_textarea", placeholder: "请输入反馈意见"})
									)
								)
							), 
							React.createElement("div", {className: "weui_btn_area"}, 
								React.createElement("button", {className: "weui_btn weui_btn_primary", type: "submit"}, "确定")
							)
						)
					)
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
		this.setState({
			signidWantToReset: ev.target.dataset.signid
		});
		ReactDOM.render(
			React.createElement(ConfirmDialog, {callback: this.confirmReset, title: "取消报名", 
				content: "您确定要取消该活动的报名吗？"}),
			document.getElementById("confirm-dialog-wrap")
		);
	},
	confirmReset: function (argument) {
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/reset',
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":'9901',"signid": this.state.signidWantToReset },
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
			React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
		});
	},

	componentDidMount: function() {
	 	this.pullFromServer();
	},
	pullFromServer:function(){
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/my',
			//url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:'9901',page:"1",pagesize:"100" },
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
					React.createElement("li", null, 
						React.createElement("header", {className: "ss-hd"}, elem.title), 
						React.createElement("p", {className: "time clearfix"}, 
							React.createElement("span", null, "活动时间"), React.createElement("time", null, elem.time_act)
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
			url: 'http://121.42.41.241:9900/activities/mycollections',
			//url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:'9901',page:"1",pagesize:"100" },
			success: function(res) {
				console.log("mycollections success");
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("mycollections error");
			}.bind(this)
		});
	},

	delCollectionHandler: function (event) {
		var collid = event.target.dataset.collid;
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/reset_collection',
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":'9901',"collid": collid },
		})
		.done(function() {
			this.pullFromServer();
		}.bind(this))
		.fail(function() {
			console.log("delCollection error");
		})
		.always(function() {
			console.log("delCollection complete");
		});
	},

	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					React.createElement("li", null, 
						React.createElement("header", {className: "ss-hd"}, elem.title), 
						React.createElement("p", {className: "time clearfix"}, 
							React.createElement("span", null, "活动时间"), React.createElement("time", null, elem.time_act)
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


var ConfirmDialog = React.createClass({displayName: "ConfirmDialog",
	reset: function(){
		React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
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
