var Me = React.createClass({displayName: "Me",
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
	render: function() {
		return (
			React.createElement("div", {className: "me"}, 
				React.createElement("div", {className: "cell"}, 
					React.createElement("div", {className: "hd tc"}, 
						React.createElement("img", {src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==", alt: ""}), 
						React.createElement("p", {className: "name"}, "张三")
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
			activities: [1, 2, 3, 4, 5, 6, 7]
		};
	},
	signReset: function(ev){
		var uid = ev.target.dataset.uid;
		ReactDOM.render(
			React.createElement(ConfirmDialog, {callback: confirmReset, title: "取消报名", 
				content: "您确定要取消该活动的报名吗？"}),
			document.getElementById("confirm-dialog-wrap")
		);
		function confirmReset(){
			$.ajax({
				url: 'acitivities/reset',
				type: 'post',
				dataType: 'json',
				data: {uid: 'value1'},
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

		}
	},
	componentDidMount: function() {
	 	this.pullFromServer();
	},
	pullFromServer:function(){
		$.ajax({
			url: '/activities/my',
			type: 'get',
			dataType: 'json',
			data: {param1: 'value1'},
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	},
	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(index, elem) {
				return (
					React.createElement("li", null, 
						React.createElement("header", {className: "ss-hd"}, "西关亲子游活动"), 
						React.createElement("p", {className: "time clearfix"}, 
							React.createElement("span", null, "活动时间"), React.createElement("time", null, "2016-07-20 10:00")
						), 
						React.createElement("div", {className: "time clearfix"}, 
							React.createElement("span", null, "报名时间"), React.createElement("time", null, "2016-07-20 10:00")
						), 
						React.createElement("button", {type: "button", onClick: this.signReset, 
							"data-uid": index, className: "weui_btn weui_btn_mini weui_btn_default"}, 
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
