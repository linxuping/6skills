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
				this.setState({
					activity: res
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
						<p className="privilage">降价10%</p>
						<p className="money clearfix">
							<span className="now fl">现价￥750.00</span>
							<span className="original fr">原价￥820.00</span>
						</p>
						<p className="age">0-3岁</p>
						<p className="time">活动时间: 6月30日14：00 ~ 16：00</p>
						<p className="area">活动地点：东山番茄苗艺术中心</p>
						<p className="detail-content">东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心东山番茄苗艺术中心
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
