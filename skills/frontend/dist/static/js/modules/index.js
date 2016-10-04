var Index = React.createClass({displayName: "Index",

	getInitialState: function() {
		return {
			activities: [],
			pageable: {}
		};
	},

	componentDidMount: function() {
		this.fatchActivities();
	},

	moreClick: function() {
	  var pageable = this.state.pageable;
		pageable.page += 1;
		this.setState({
			pageable: pageable
		});
		this.fatchActivities();
	},

	fatchActivities: function(){
		var page = this.state.pageable.page || 1;
		var url =  '/activities/special-offers?area=*&age=0-100&pagesize=5&city&district=*';
		$.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {openid: geopenid(), page: page}
		})
		.done(function(res) {
			if (res.errcode == 0) {
				if (res.pageable.page == 1)
					activities = res.activities;
				else
					activities = this.state.activities.concat(res.activities);
				this.setState({
					activities: activities,
					pageable: res.pageable
				});
			}
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	},

	render: function() {
		return (
			React.createElement("div", {className: "Index"}, 
				React.createElement(Carousel, {url: "/activities/hot/list"}), 
				React.createElement(Navigation, null), 
				React.createElement(Activities, {activities: this.state.activities, pageable: this.state.pageable, 
					moreClick: this.moreClick})
			)
		);
	}
});

var Carousel = React.createClass({displayName: "Carousel",

	getInitialState: function() {
		return {
			activities: []
		};
	},

	componentDidMount: function() {
		this.fatchData()
	},

	fatchData: function(){
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
		})
		.done(function(res) {
			if (res.errcode == 0) {
				this.setState({
					activities: res.activities
				});
			}
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	},

	clickHandler: function(activity) {
	  location.href = "activity_detail.html?actid=" + activity.id;
	},

	render: function() {
		var settings = {
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false
		};
		return (
			React.createElement("div", {className: "carousel"}, 
				React.createElement(Slider, React.__spread({},  settings), 
					
						this.state.activities.map(function(elem, idx) {
							return (
								React.createElement("div", {className: "item", key: idx, onClick: this.clickHandler.bind(this, elem)}, 
									React.createElement("img", {src: elem.img}), 
									React.createElement("div", {className: "title-box"}, 
										React.createElement("h3", {className: "title"}, elem.act_name || "标题")
									)
								)
							);
						}.bind(this))
					
				)
			)
		);
	}
});

var Navigation = React.createClass({displayName: "Navigation",

	getInitialState: function() {
		return {
			btns: []
		};
	},
	
	componentDidMount: function() {
		$.ajax({
			url: '/wx/acttypes/list',
			type: 'get',
			dataType: 'json'
		})
		.done(function(res) {
			console.log("success");
			if (res.errcode == 0) {
				this.setState({
					btns: res.values
				});
			}
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	},

	render: function() {
		var btns = [
			{url: "#", name: "音乐"},
			{url: "#", name: "舞蹈"},
			{url: "#", name: "书画"},
			{url: "#", name: "全部"}
		];
		return (
			React.createElement("div", {className: "weui_panel", style: {marginTop: 0}}, 
				React.createElement("div", {className: "weui_panel_bd", style: {padding: "0 10px"}}, 
					React.createElement("div", {className: "ss-flex"}, 
						
							this.state.btns && this.state.btns.map(function(elem, index) {
								return (
									React.createElement("div", {className: "ss-flex-item nav-item", key: index}, 
										React.createElement("a", {href: "activities.html?acttype=" + encodeURIComponent(elem)}, 
											React.createElement("img", {src: "/static/img/icon_0" + (index + 1) + ".gif", alt: ""}), 
											React.createElement("div", {className: "clear"}), 
											React.createElement("span", {className: "text"}, elem)
										)
									)
								);
							})
						
					)
				)
			)
		);
	}
});
