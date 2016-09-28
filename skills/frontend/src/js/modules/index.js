var Index = React.createClass({

	getInitialState: function() {
		return {
			activities: []
		};
	},

	componentDidMount: function() {
		this.fatchActivities();
	},

	fatchActivities: function(){
		var url =  '/activities/special-offers?area=*&age=0-100&page=1&pagesize=5&city&district=天河区';
		$.ajax({
			url: url,
			type: 'get',
			dataType: 'json',
			data: {openid: geopenid()},
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

	render: function() {
		return (
			<div className="Index">
				<Carousel url="/activities/hot/list"></Carousel>
				<Navigation></Navigation>
				<Activities activities={this.state.activities} pageable="no"></Activities>
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
			<div className="carousel">
				<Slider {...settings}>
					{
						this.state.activities.map(function(elem, idx) {
							return (
								<div className="item" key={idx}>
									<img src={elem.img} />
									<div className="title-box">
										<h3 className="title">{elem.act_name || "标题标题标题标题"}</h3>
									</div>
								</div>
							);
						})
					}
				</Slider>
			</div>
		);
	}
});

var Navigation = React.createClass({
	render: function() {
		var btns = [
			{url: "#", name: "声乐"},
			{url: "#", name: "舞蹈"},
			{url: "#", name: "美术"},
			{url: "#", name: "全部"}
		];
		return (
			<div className="weui_panel" style={{marginTop: 0}}>
				<div className="weui_panel_bd">
					<div className="ss-flex">
						{
							btns.map(function(elem, index) {
								return (
									<div className="ss-flex-item nav-item" key={index}>
										<a href={"activities.html" + elem.url}>
											<img src={"/static/img/icon_0" + (index + 1) + ".gif"} alt=""/>
											<div className="clear"></div>
											<span className="text">{elem.name}</span>
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
