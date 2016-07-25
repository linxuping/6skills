var Appobj = null;
var App = React.createClass({ //
	getInitialState: function() {
		Appobj = this;
		return {
			activities: [],
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

		console.log(area);
		console.log(age);
		$.ajax({
			url: "http://121.42.41.241:9900/activities/special-offers",
			type: 'get',
			dataType: 'json',
			data: {"area":area,"age":age,"page":"1","pagesize":"100"},
			success: function(res) {
				console.log(res.activities);
				this.setState({
					activities: res.activities
				});
			}.bind(this),
			error: function() {
				this.setState({
					activities: []
				});
				console.log("App error");
			}.bind(this),
		});
	},

	componentDidMount: function() {
		this.updateActivities();
	},

	render: function() {
		console.log("rending.");
		console.log(this.state.activities);
		//this.updateActivities();
		return (
			<div className="app">
				<SelectHeader />
				<Activities activities={this.state.activities}/>
			</div>
		);
	}
});

var SelectHeader = React.createClass({
	render: function() {
		return (
			<div className="select-header">
				<Selecter name="area" text="地区选择" url="http://121.42.41.241:9900/activities/get-areas?city=%E5%B9%BF%E5%B7%9E%E5%B8%82"/>
				<Selecter name="age" text="年龄选择" url="http://121.42.41.241:9900/activities/get-agesel"/>
			</div>
		);
	}
});

var Selecter = React.createClass({
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
			<div className="selecter">
				<label forHtml={this.props.name}>{this.props.text}:</label>
				<select name={this.props.name} className="weui_select ss-select" onChange={this.selectChanged}>
					<option value="不限">不限</option>
					{ this.state.values.map(function(elem) {
							return (<option value={elem}>{elem}</option>);
					}) }
				</select>
			</div>
		);
	}
});

var Activities = React.createClass({
	render: function() {
		var liStr = this.props.activities &&
					this.props.activities.map(function(elem, index) {
			return (
				<li className="ss-media-box">
					<div className="weui_media_box weui_media_appmsg" data-uuid={index}>
						<div className="weui_media_hd ss-media-hd">
							<img className="weui_media_appmsg_thumb" src={elem.img_cover} alt=""/>
						</div>
						<div className="weui_media_bd ss-media-bd">
							<h4 className="weui_media_title">
								{elem.title}
							</h4>
							<p className="weui_media_desc">活动剩余名额：{elem.quantities_remain}名</p>
							<p className="weui_media_desc">{elem.tags}</p>
							<p className="weui_media_desc">{elem.area}</p>
							<p className="weui_media_desc">{elem.ages}岁</p>
						</div>
					</div>
					<div className="ss-join-bd clearfix">
						<div className="money-box fl">￥{elem.price_current}</div>
						<button className="weui_btn weui_btn_mini weui_btn_primary fr">我要报名</button>
					</div>
				</li>
			);
		});

		return (
			<div className="activities-list weui_panel_access">
				<ul className="weui_panel_bd">
					{liStr}
				</ul>
			</div>
		);
	}
});
