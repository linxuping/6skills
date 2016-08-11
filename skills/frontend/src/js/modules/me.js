var Me = React.createClass({
	getInitialState: function() {
		return {
			username: "",
			phone: "",
			img: "",
		};
	},
	componentDidMount: function(){
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/get_profile',
			type: 'get',
			dataType: 'json',
			data: { "openid":'9901' },
		})
		.done(function(res) {
			console.log("success");
			console.log(res.profile.username);
			console.log(res.profile.img);
			if (res.errcode != 0){
				location.href="http://121.42.41.241:9900/template/verify_phone.html";
				return;
			}
			this.setState( { "username":res.profile.username,"phone":res.profile.phone,"img":res.profile.img } );
		}.bind(this))
		.fail(function() {
			console.log("fail");
		});
	},
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
		document.title = "我";
	},
	gotoFeedback: function(){
		document.title = "意见反馈";
		ReactDOM.render(
			<Feedback back={this.back}/>, document.getElementById("sign-page-wrap")
		);
	},

	gotoMyActivities: function(){
		document.title = "已报名活动";
		ReactDOM.render(
			<MyActivities back={this.back}/>, document.getElementById("sign-page-wrap")
		);
	},
	gotoMyCollections: function () {
		document.title = "我的收藏";
		ReactDOM.render(
			<MyCollections back={this.back}/>,
			document.getElementById("sign-page-wrap")
		);
	},
	render: function() {
		return (
			<div className="me">
				<div className="cell">
					<div className="hd tc">
						<img src={this.state.img} alt=""/>
						<p className="name">{this.state.username}</p>
					</div>
					<div className="bd">
						<div className="weui_cells weui_cells_access">
							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoMyActivities}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>已报名活动</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>

							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoMyCollections}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>我的收藏</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>

							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoFeedback}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>意见反馈</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>
						</div>
					</div>
				</div>
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});

var Feedback = React.createClass({
	render: function() {
		return (
			<div className="feedback sign-page">
				<div className="back-btn" onClick={this.props.back}>返回</div>
				<form action="#">

					<input type="hidden" name="uid" value=""/>

					<div className="cell">
						<div className="bd">
							<div className="weui_cells weui_cells_form">
								<div className="weui_cell">
									<div className="weui_cell_bd weui_cell_primary">
										<textarea name="feedback" id="feedback" rows="4" className="weui_textarea" placeholder="请输入反馈意见"></textarea>
									</div>
								</div>
							</div>
							<div className="weui_btn_area">
								<button className="weui_btn weui_btn_primary" type="submit">确定</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
});

var MyActivities = React.createClass({
	getInitialState: function() {
		return {
			activities: []
		};
	},
	signReset: function(ev){
		this.setState({
			signidWantToReset: ev.target.dataset.signid
		});
		ReactDOM.render(
			<ConfirmDialog callback={this.confirmReset} title="取消报名"
				content="您确定要取消该活动的报名吗？"/>,
			document.getElementById("confirm-dialog-wrap")
		);
	},
	confirmReset: function (argument) {
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/reset',
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":'9901',"signid": this.state.signidWantToReset },
		})
		.done(function() {
			console.log("success");
			console.log("取消报名成功")
			this.pullFromServer();
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
		});
	},

	componentDidMount: function() {
	 	this.pullFromServer();
	},
	pullFromServer:function(){
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/my',
			//url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:'9901',page:"1",pagesize:"100" },
			success: function(res) {
				console.log("success");
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("error");
			}.bind(this)
		});
	},
	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					<li>
						<header className="ss-hd">{elem.title}</header>
						<p className="time clearfix">
							<span>活动时间</span><time>{elem.time_act}</time>
						</p>
						<div className="time clearfix">
							<span>报名时间</span><time>{elem.time_signup}</time>
						</div>
						<button type="button" onClick={this.signReset}
							data-uid={index} data-signid={elem.signid} className="weui_btn weui_btn_mini weui_btn_default">
							取消
						</button>
					</li>
				);
			}.bind(this));
		return (
			<div className="myActivities sign-page" style={{"overflow": "auto"}}>
				<div className="back-btn" onClick={this.props.back}>返回</div>
				<div className="cell">
					<ul className="my-activities">
						{myActivitiesStr}
					</ul>
					<div id="confirm-dialog-wrap"></div>
				</div>
			</div>
		);
	}
});

var MyCollections = React.createClass({
	getInitialState: function() {
		return {
			activities: []
		};
	},
	componentDidMount: function() {
		this.pullFromServer();
	},
	pullFromServer: function() {
		$.ajax({
			//url: 'http://121.42.41.241:9900/activities/my',
			url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:'9901',page:"1",pagesize:"100" },
			success: function(res) {
				console.log("success");
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("error");
			}.bind(this)
		});
	},

	delCollectionHandler: function (event) {
		var actid = event.target.dataset.actid;
		$.ajax({
			url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":'9901',"actid": this.state.signidWantToReset },
		})
		.done(function() {
			this.pullFromServer();
		}.bind(this))
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	},

	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					<li>
						<header className="ss-hd">{elem.title}</header>
						<p className="time clearfix">
							<span>活动时间</span><time>{elem.time_act}</time>
						</p>
						<button type="button" onClick={this.delCollectionHandler}
							data-uid={index} data-actid={elem.actid} className="weui_btn weui_btn_mini weui_btn_default">
							删除
						</button>
					</li>
				);
			}.bind(this));
		return (
			<div className="myActivities sign-page" style={{"overflow": "auto"}}>
				<div className="back-btn" onClick={this.props.back}>返回</div>
				<div className="cell">
					<ul className="my-activities">
						{myActivitiesStr}
					</ul>
					<div id="confirm-dialog-wrap"></div>
				</div>
			</div>
		);
	}
});


var ConfirmDialog = React.createClass({
	reset: function(){
		React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
	},
	render: function() {
		return (
			<div className="weui_dialog_confirm" id="confirm-dialog">
		    <div className="weui_mask"></div>
		    <div className="weui_dialog">
	        <div className="weui_dialog_hd">
	        	<strong className="weui_dialog_title">{this.props.title || "提示"}</strong>
	        </div>
	        <div className="weui_dialog_bd">
	        {this.props.content}
	        </div>
	        <div className="weui_dialog_ft">
	            <a href="javascript:;" className="weui_btn_dialog default"
	               onClick={this.reset}>取消</a>
	            <a href="javascript:;" className="weui_btn_dialog primary"
	            	onClick={this.props.callback}>
	            	确定</a>
	        </div>
		    </div>
			</div>
		);
	}
});
