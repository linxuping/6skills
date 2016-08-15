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
						<p className="money clearfix">
							{(this.state.activity.price_child_pre==null)? "":<span className="now fl">儿童价￥{this.state.activity.price_child_pre}</span>}
							{(this.state.activity.price_child==-1)?     "":<span className="original fr">儿童 原价￥{this.state.activity.price_child}</span>}
							<br/>
							{(this.state.activity.price_adult_pre==null)? "":<span className="now fl">大人价￥{this.state.activity.price_adult_pre}</span>}
							{(this.state.activity.price_adult==-1)?   "":<span className="original fr">大人 原价￥{this.state.activity.price_adult}</span>}
						</p>
						<p className="privilage"><b>{this.state.activity.preinfo}</b></p>
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
