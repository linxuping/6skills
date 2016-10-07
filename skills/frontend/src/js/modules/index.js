var dropload;
var Index = React.createClass({

	getInitialState: function() {
		return {
			activities: [],
			pageable: {}
		};
	},

	componentDidMount: function() {
		
	},

	moreClick: function() {
	  var pageable = this.state.pageable;
		pageable.page += 1;
		this.setState({
			pageable: pageable
		});
		this.fatchActivities();
	},

	updateActivities: function(callback){
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
				dropload.resetload();
			}
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			callback && setTimeout(function(){
				callback();
			}, 200)
		});

	},

	render: function() {
		return (
			<div className="Index">
				<Carousel url="/activities/hot/list"></Carousel>
				<Navigation></Navigation>
				<Activities activities={this.state.activities}
					app={this} scrollArea=".Index"></Activities>
			</div>
		);
	}
});

var Carousel = React.createClass({

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
			autoplay: true,
			autoplaySpeed: 5000,
			pauseOnHover: true,
			speed: 500,
			lazyLoad:true,
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1
		};
		return (
			<div className="carousel">
				<Slider {...settings}>
					{
						this.state.activities.map(function(elem, idx) {
							return (
								<div className="item" key={idx} onClick={this.clickHandler.bind(this, elem)}>
									<img src={elem.img} />
									<div className="title-box">
										<h3 className="title">{elem.act_name || "标题"}</h3>
									</div>
								</div>
							);
						}.bind(this))
					}
				</Slider>
			</div>
		);
	}
});

var Navigation = React.createClass({

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
			<div className="weui_panel" style={{marginTop: 0}}>
				<div className="weui_panel_bd" style={{padding: "0 10px"}}>
					<div className="ss-flex">
						{
							this.state.btns && this.state.btns.map(function(elem, index) {
								return (
									<div className="ss-flex-item nav-item" key={index}>
										<a href={"activities.html?acttype=" + encodeURIComponent(elem)}>
											<img src={"/static/img/icon_0" + (index + 1) + ".gif"} alt=""/>
											<div className="clear"></div>
											<span className="text">{elem}</span>
										</a>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
		);
	}
});
