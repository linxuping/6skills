function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
function IsNum(s)
{
	if(s!=null){
		var r,re;
		re = /\d*/i; //\d表示数字,*表示匹配多个数字
		r = s.match(re);
		return (r==s)?true:false;
	}
	return false;
}
var ActivityDetail = React.createClass({
	getInitialState: function() {
		return {
			activity: {},
			imgs: {},
			loaded: false
		};
	},
	openSignPage: function(){
		ReactDOM.render(
			React.createElement(Sign, null),
			document.getElementById('sign-page-wrap')
		);
	},
	componentDidMount: function() {
		var actid = getUrlParam("actid");
		if (!IsNum(actid)){
			alert("actid must be number.");
			return;
		}
		$.ajax({
			url: "http://121.42.41.241:9900/activities/details",
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
						<p className="detail-content">{this.state.activity.content}
						</p>
					</div>
				</article>
				<div className="sign-btn" style={{"cursor": "pointer"}}
					onClick={this.openSignPage}>
					我要报名
				</div>
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});
