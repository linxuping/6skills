var ActivityDetail = React.createClass({displayName: "ActivityDetail",
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
			React.createElement("div", {className: "activity-detail"}, 
				React.createElement("article", {className: "media"}, 
					React.createElement("div", {className: "media-hd"}, 
						React.createElement("img", {src: this.state.activity.img_cover, alt: ""})
					), 
					React.createElement("h4", {className: "title"}, this.state.activity.title), 
					React.createElement("div", {className: "media-bd"}, 
						React.createElement("p", {className: "privilage"}, this.state.activity.preinfo), 
						React.createElement("p", {className: "money clearfix"}, 
							React.createElement("span", {className: "now fl"}, "现价￥", this.state.activity.price_current), 
							React.createElement("span", {className: "original fr"}, "原价￥", this.state.activity.price_original)
						), 
						React.createElement("p", {className: "age"}, this.state.activity.ages, "岁"), 
						React.createElement("p", {className: "time"}, "活动时间: ", this.state.activity.time_from, " ~ ", this.state.activity.time_to), 
						React.createElement("p", {className: "area"}, "活动地点：", this.state.activity.area), 
						React.createElement("p", {className: "detail-content"}, React.createElement("div", {dangerouslySetInnerHTML: {__html: this.state.activity.content}})
						)
					)
				), 
				React.createElement("div", {className: "sign-btn", style: {"cursor": "pointer"}, 
					onClick: this.openSignPage}, 
					"我要报名"
				), 
				React.createElement("div", {id: "sign-page-wrap"})
			)
		);
	}
});
