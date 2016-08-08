var Appobj = null;
var App = React.createClass({displayName: "App", //
	getInitialState: function() {
		Appobj = this;
		return {
			activities: [],
			pageable: {},
			age: null,
			area: null,
			loaded: false
		};
	},

	updateActivities: function() {
		console.log("componentDidMount");
		var area = this.props.area;
		//console.log(area);
		if (this.state.age == null)
			age = "0_100";
		else
			age = this.state.age;
		if (this.state.area == null)
			area = "*";
		else
			area = this.state.area;

		//console.log(area);
		//console.log(age);
		var args = {"area":area,"age":age,"page": this.state.pageable.page || 1,"pagesize":10,"city":"","district":"天河区"};
		if (this.props.type == "preview")
			args["type"] = "preview";
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
			data: args,
			success: function(res) {
				//console.log(res.activities);
				var activities = this.state.activities.concat(res.activities)
				this.setState({
					activities: activities,
					pageable: res.pageable
				});
				// myScroll = new IScroll('#wrapper', { mouseWheel: true });
				// myScroll.on('scrollEnd', function(){
				// 	console.log(event);
				// 	//alert('msg');
				// });
			}.bind(this),
			error: function() {
				this.setState({
					activities: []
				});
				console.log("App error");
			}.bind(this),
		});
	},

	moreClickHandler: function () {
		var pageable = this.state.pageable;
		pageable.page += 1;
		this.setState({
			pageable: pageable
		});
		this.updateActivities();
	},

	componentDidMount: function() {
		this.updateActivities();
	},

	render: function() {
		console.log("rending.");
		console.log(this.state.activities);
		//this.updateActivities();
		return (
			React.createElement("div", {className: "app"}, 
				React.createElement(SelectHeader, null), 
				React.createElement(Activities, {activities: this.state.activities, pageable: this.state.pageable, 
					moreClick: this.moreClickHandler, type: this.props.type})
			)
		);
	}
});

//				<Selecter name="area" text="地区选择" url="http://121.42.41.241:9900/activities/get-areas?city=%E5%B9%BF%E5%B7%9E%E5%B8%82"/>
var SelectHeader = React.createClass({displayName: "SelectHeader",
	render: function() {
		return (
			React.createElement("div", {className: "select-header"}, 
				React.createElement(Selecter, {name: "age", text: "年龄选择", url: "http://121.42.41.241:9900/activities/get-agesel"})
			)
		);
	}
});

var Selecter = React.createClass({displayName: "Selecter",
	getInitialState: function() {
		return {
			values: [],
			loaded: false
		};
	},
	componentDidMount: function() {
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
			data: {},
			success: function(res) {
				this.setState({
					values: res.values
				});
			}.bind(this),
			error: function() {
				console.log("Selecter error: "+this.props.url);
			}.bind(this),
			complete: function() {
				//console.log("Selecter complete");
			}.bind(this)
		});
	},
	selectChanged: function() {
		//this.setState({value: event.target.value});
		//console.log(event.target.value);
		//console.log(App);
		//console.log(Appobj);
		if (this.props.name == "area"){
			Appobj.state.area = event.target.value;
		}
		else if (this.props.name == "age"){
			if (event.target.value == "不限")
				Appobj.state.age = "0_100";
			else
				Appobj.state.age = event.target.value;
		}
		Appobj.updateActivities();
		Appobj.setState({loaded: !Appobj.state.loaded});
		//Appobj.setState({activities: [1,2,3,4,5,6]});
		/*ReactDOM.render(
			React.createElement(App, null),
			document.getElementById('content')
		).setState({activities: [1,2,3,4,5,6]});*/
	},
	render: function() {
		return (
			React.createElement("div", {className: "selecter"}, 
				React.createElement("label", {forHtml: this.props.name}, this.props.text, ":"), 
				React.createElement("select", {name: this.props.name, className: "weui_select ss-select", onChange: this.selectChanged}, 
					React.createElement("option", {value: "不限"}, "不限"), 
					 this.state.values.map(function(elem) {
							return (React.createElement("option", {value: elem}, elem, "岁"));
					}) 
				)
			)
		);
	}
});

var Activities = React.createClass({displayName: "Activities",
	openSignupPage: function(actid){
		//console.log(event)
		//location.href='/template/activity_detail.html?actid='+actid;
		ReactDOM.render(
			React.createElement(Sign, {actid: actid}),
			document.getElementById("sign-page-wrap")
		);
	},
	openDetailPage: function (actid) {
		if (event.target.tagName == "BUTTON") {
			return false;
		}
		location.href='/template/activity_detail.html?actid='+actid;
	},

	render: function() {
		console.log(this.props.activities)
		var liStr = this.props.activities &&
					this.props.activities.map(function(elem, index) {
			return (
				React.createElement("li", {className: "ss-media-box", 
					onClick: this.openDetailPage.bind(this, elem.actid)}, 
					React.createElement("div", {className: "weui_media_box weui_media_appmsg"}, 
						React.createElement("div", {className: "weui_media_hd ss-media-hd"}, 
							React.createElement("img", {className: "weui_media_appmsg_thumb", src: elem.img_cover, alt: ""})
						), 
						React.createElement("div", {className: "weui_media_bd ss-media-bd"}, 
							React.createElement("h4", {className: "weui_media_title"}, 
								elem.title
							), 
							React.createElement("p", {className: "weui_media_desc"}, "活动剩余名额：", elem.quantities_remain, "名"), 
							React.createElement("p", {className: "weui_media_desc"}, elem.tags), 
							React.createElement("p", {className: "weui_media_desc"}, elem.area), 
							React.createElement("p", {className: "weui_media_desc"}, elem.ages, "岁")
						)
					), 
					React.createElement("div", {className: "ss-join-bd clearfix"}, 
						React.createElement("div", {className: "money-box fl"}, "￥", elem.price_current), 
						React.createElement("button", {className: "weui_btn weui_btn_mini weui_btn_primary fr", 
							onClick: this.openSignupPage.bind(this,elem.actid)}, 
							this.props.type == "preview" ? "我要报名" : "限时报名"
						)
					)
				)
			);
		}.bind(this));
		var moreBtn
		if (this.props.pageable.total && this.props.pageable.total > this.props.pageable.page) {
			moreBtn = React.createElement("div", {className: "more-btn", onClick: this.props.moreClick}, 
									"点击加载更多..."
								)
		}

		return (
			React.createElement("div", {className: "activities-list weui_panel_access", id: "wrapper"}, 
				React.createElement("div", {id: "scroller"}, 
					React.createElement("ul", {className: "weui_panel_bd"}, 
						liStr
					), 
					moreBtn, 
					React.createElement("div", {id: "sign-page-wrap"})
				)
			)
		);
	}
});
