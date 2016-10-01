var Appobj = null;
var App = React.createClass({ //
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
			age = "0-100";
		else
			age = this.state.age;
		if (this.state.area == null)
			area = "*";
		else
			area = this.state.area;

		//console.log(area);
		//console.log(age);
		var args = {"area":area,"age":age,"page": this.state.pageable.page || 1,"pagesize":10,"city":"","district":"天河区","openid":geopenid()};
		if (this.props.type == "preview")
			args["type"] = "preview";
		$.ajax({
			url: this.props.url,
			type: 'get',
			dataType: 'json',
			data: args,
			success: function(res) {
				var activities = null;
				if (res.pageable.page == 1)
					activities = res.activities;
				else
					activities = this.state.activities.concat(res.activities);
				this.setState({
					activities: activities,
					pageable: res.pageable
				});
				console.log("[updateActivities.]");
				console.log(res.activities);
				console.log(this.state.activities);
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
		console.log("[rending.]");
		console.log(this.state.activities);
		console.log(this.state.pageable);
		var get_areas_url = ges("activities/get-areas?city="+get_area());
		//this.updateActivities();
		return (
			<div className="app">
				<SelectHeader />
				<div style={{marginTop: 90}}>
				<Activities activities={this.state.activities} pageable={this.state.pageable}
					moreClick={this.moreClickHandler} type={this.props.type} />
				</div>
			</div>
		);
	}
});

//<Selecter name="area" text="地区选择" url={get_areas_url}/>
var SelectHeader = React.createClass({

	render: function() {
		var ages = [];
		for (var i = 1; i < 13; i++) {
			ages.push(i + "岁");
		}
		//var get_agesel_url = ges("activities/get-agesel");
		return (
			<div className="select-header">
			<Selecter name="acttype" text="声乐" url="/wx/acttypes/list"/>
				<Selecter name="area" text="天河区" url="/wx/nearbyareas/list"/>
				<Selecter name="age" text="8岁" menus={ages}/>
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
		if (this.props.url) {
			$.ajax({
				url: this.props.url,
				type: 'get',
				dataType: 'json',
				data: {openid: geopenid()},
				success: function(res) {
					this.setState({
						menus: res.values
					});
				}.bind(this),
				error: function() {
					console.log("Selecter error: "+this.props.url);
				}.bind(this),
				complete: function() {
					//console.log("Selecter complete");
				}.bind(this)
			});
		} else {
			this.setState({
				menus: this.props.menus
			});
		}


		//获取用户信息,如果没有
		if (sessionStorage.getItem("_profile")!==undefined  && sessionStorage.getItem("_profile")!= null) {
			return;
		}
		$.ajax({
			url: ges('activities/get_profile'),
			//url: "/test/get_profile.json",
			type: 'get',
			dataType: 'json',
			data: { "openid": geopenid() }
		})
		.done(function(res) {
			console.log("success");
			if (res.errcode == 0) {
				sessionStorage.setItem("_profile", JSON.stringify(res.profile));
			}
		}.bind(this))
		.fail(function() {
			console.log("error");
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
				Appobj.state.age = "0-100";
			else
				Appobj.state.age = event.target.value;
		}
		Appobj.state.pageable.page = 1;
		Appobj.updateActivities();
		//Appobj.setState({loaded: !Appobj.state.loaded});
		//Appobj.setState({activities: [1,2,3,4,5,6]});
		/*ReactDOM.render(
			React.createElement(App, null),
			document.getElementById('content')
		).setState({activities: [1,2,3,4,5,6]});*/
	},

	labelClick: function(){
		this.setState({
			showSheet: true
		});
	},

	hideSheet: function(){
		this.setState({
			showSheet: false
		});
	},

	render: function() {
		return (
			<div className="selecter">
				<div className="tt" onClick={this.labelClick}>
					<div className="txt">{this.props.text}</div>
					<div className="tri"></div>
				</div>
				<div className="actionsheet-wrap">
					<div className={this.state.showSheet ? "weui_mask_transition show" : "weui_mask_transition "} onClick={this.hideSheet}>
						<div className={this.state.showSheet ? "weui_actionsheet weui_actionsheet_toggle" : "weui_actionsheet"}>
							<div className="weui_actionsheet_menu">
								{
									this.state.menus && this.state.menus.length > 0 ?
									this.state.menus.map(function(elem, index) {
										return (
											<div className="weui_actionsheet_cell" key={index} value={elem}>
												{elem}
											</div>
										);
									})
									:
									<div className="weui_actionsheet_cell" value="none">
										暂无数据
									</div>
								}
							</div>
							<div className="weui_actionsheet_action">
								<div className="weui_actionsheet_cell" value="none" onClick={this.hideSheet}>
									取消
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var Activities = React.createClass({
	openSignupPage: function(event){
		event.stopPropagation();
		var actid = event.target.dataset.actid;
		var remains = event.target.dataset.quantitiesremain;
		//console.log(event)
		//location.href='/template/activity_detail.html?actid='+actid;
		if (remains == 0) {
			sessionStorage.setItem('_remains_' + actid, remains)
			location.href='/template/activity_detail.html?actid=' + actid;
		}
		if ($(event.target).hasClass('weui_btn_disabled')) {
			return false;
		}
		ReactDOM.render(
			React.createElement(Sign, {actid: actid}),
			document.getElementById("sign-page-wrap")
		);
	},
	openDetailPage: function (actid, remains) {
		if (event.target.tagName == "BUTTON") {
			return false;
		}
		// console.log(remains);
		sessionStorage.setItem('_remains_' + actid, remains)
		location.href='/template/activity_detail.html?actid='+actid;
	},

	render: function() {
		var moreBtn
		if (this.props.pageable.total>1 && this.props.pageable.total > this.props.pageable.page) {
			moreBtn = <div className="more-btn" onClick={this.props.moreClick}>
									点击加载更多...
								</div>
		}
		return (
			<div className="activities" id="wrapper">
				<ul className="activities-list">
					{
						this.props.activities &&
						this.props.activities.map(function(elem, index) {
							return (
								<li className="activity-item" key={index}
									onClick={this.openDetailPage.bind(this, elem.actid, elem.quantities_remain)}>
									<div className="weui_panel">
										<div className="weui_panel_bd">
											<div className="weui_media_box weui_media_appmsg">
												<div className="weui_media_hd ss-media-hd">
													<img className="weui_media_appmsg_thumb" src={elem.img_cover} alt=""/>
													<div className="money">￥{Number(elem.price_child).toFixed(2)}</div>
												</div>
												<div className="weui_media_bd ss-media-bd">
													<h4 className="title">
														{elem.title}
													</h4>
													{/*<p className="weui_media_desc">活动剩余名额：{ (elem.quantities_remain>1000000)? "不限": <font>{elem.quantities_remain}名</font> }</p>*/}
													<p className="fl ot">{elem.tags}</p>
													<p className="fl ot">{elem.area}</p>
													<p className="fl ot">{elem.ages}岁</p>
												</div>
											</div>
										</div>
										<div className="weui_panel_bd">
											<ul className="ttt">
												<li className="tt clearfix">
													<span className="pp red">限时</span>
													<span className="txt">限时优惠，每周六晚上17:00-19:00</span>
												</li>
												<li className="tt clearfix">
													<span className="pp yellow">保障</span>
													<span className="txt">宝爸全程跟课，满意才收费。</span>
												</li>
											</ul>
										</div>

									</div>
								</li>
							);
						}.bind(this))
					}
				</ul>
				{moreBtn}
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});
