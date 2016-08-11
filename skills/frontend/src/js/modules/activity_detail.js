var ActivityDetail = React.createClass({
	getInitialState: function() {
		return {
			activity: {},
			imgs: {},
			loaded: false
		};
	},
	openSignPage: function(){
		document.title = "活动报名";
		ReactDOM.render(
			React.createElement(Sign, {actid: this.props.actid, backTitle: "活动详情"}),
			document.getElementById('sign-page-wrap')
		);
	},
	collectPage: function(){
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/collect',
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":'9901',"actid": this.props.actid },
		})
		.done(function() {
			alert("收藏成功.")
		}.bind(this))
		.fail(function() {
			console.log("collect error");
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
			data: { "actid":actid },
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
						<p className="privilage">{this.state.activity.preinfo}</p>
						<p className="money clearfix">
							<span className="now fl">现价￥{this.state.activity.price_current}</span>
							<span className="original fr">原价￥{this.state.activity.price_original}</span>
						</p>
						<p className="age">{this.state.activity.ages}岁</p>
						<p className="time">活动时间: {this.state.activity.time_from} ~ {this.state.activity.time_to}</p>
						<p className="area">活动地点：{this.state.activity.area}</p>
						<p className="detail-content"><div dangerouslySetInnerHTML={{__html: this.state.activity.content}}></div>
						</p>
					</div>
				</article>
				<div className="sign-btn" style={{"cursor": "pointer"}}
					onClick={this.collectPage}>
					收藏
				</div>
				<div className="sign-btn-right" style={{"cursor": "pointer"}}
					onClick={this.openSignPage}>
					我要报名
				</div>
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});
