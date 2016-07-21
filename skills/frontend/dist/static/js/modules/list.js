var App = React.createClass({displayName: "App",
	getInitialState: function() {
		return {
			activities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			loaded: false
		};
	},

	componentDidMount: function() {
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
			data: {param1: 'value1'},
		})
		.done(function(res) {
			this.setState({
				activities: res.activities
			});
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	},

	render: function() {
		return (
			React.createElement("div", {className: "app"}, 
				React.createElement(SelectHeader, null), 
				React.createElement(Activities, {activities: this.state.activities})
			)
		);
	}
});

var SelectHeader = React.createClass({displayName: "SelectHeader",
	render: function() {
		return (
			React.createElement("div", {className: "select-header"}, 
				React.createElement(Selecter, {name: "area", text: "地区"}), 
				React.createElement(Selecter, {name: "age", text: "年龄"})
			)
		);
	}
});

var Selecter = React.createClass({displayName: "Selecter",
	render: function() {
		return (
			React.createElement("div", {className: "selecter"}, 
				React.createElement("label", {forHtml: this.props.name}, this.props.text, ":"), 
				React.createElement("select", {name: this.props.name, className: "weui_select ss-select"}, 
					React.createElement("option", {value: "aa"}, "aa")
				)
			)
		);
	}
});

var Activities = React.createClass({displayName: "Activities",
	render: function() {
		var liStr = this.props.activities &&
					this.props.activities.map(function(index, elem) {
			return (
				React.createElement("li", {className: "ss-media-box"}, 
					React.createElement("div", {className: "weui_media_box weui_media_appmsg", "data-uuid": index}, 
						React.createElement("div", {className: "weui_media_hd ss-media-hd"}, 
							React.createElement("img", {className: "weui_media_appmsg_thumb", src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==", alt: ""})
						), 
						React.createElement("div", {className: "weui_media_bd ss-media-bd"}, 
							React.createElement("h4", {className: "weui_media_title"}, 
								"标题"
							), 
							React.createElement("p", {className: "weui_media_desc"}, "活动剩余名额：15名"), 
							React.createElement("p", {className: "weui_media_desc"}, "手工DIY"), 
							React.createElement("p", {className: "weui_media_desc"}, "广州越秀区"), 
							React.createElement("p", {className: "weui_media_desc"}, "3-8岁")
						)
					), 
					React.createElement("div", {className: "ss-join-bd clearfix"}, 
						React.createElement("div", {className: "money-box fl"}, "￥750"), 
						React.createElement("button", {className: "weui_btn weui_btn_mini weui_btn_primary fr"}, "我要报名")
					)
				)
			);
		});

		return (
			React.createElement("div", {className: "activities-list weui_panel_access"}, 
				React.createElement("ul", {className: "weui_panel_bd"}, 
					liStr
				)
			)
		);
	}
});
