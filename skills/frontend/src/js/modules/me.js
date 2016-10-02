var Me = React.createClass({
	getInitialState: function() {
		return {
			username: "",
			phone: "",
			img: "",
		};
	},
	componentDidMount: function(){
		this.handlerRoute();
		$.ajax({
			url: ges('activities/get_profile'),
			type: 'get',
			dataType: 'json',
			data: { "openid":geopenid() },
		})
		.done(function(res) {
			console.log("success");
			console.log(res.profile.username);
			console.log(res.profile.img);
			if (res.errcode != 0){
				location.href=ges("template/verify_phone.html");
				return;
			}
			this.setState( { "username":res.profile.username,"phone":res.profile.phone,"img":res.profile.img } );
		}.bind(this))
		.fail(function() {
			console.log("fail");
		});
	},

	handlerRoute: function(){
		var hash = window.location.href.split("#")[1];
		if (hash !== undefined) {
			if ("myactivities".indexOf(hash) !== -1) {
				this.gotoMyActivities();
			} else if ("collections".indexOf(hash) !== -1) {
				this.gotoMyCollections();
			}
		}
	},

	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
		document.title = "我";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href);
	},
	gotoActivityDetail: function(activity){
		window.location = "activity_detail.html?actid=" + activity.actid
	},
	gotoFeedback: function(){
		document.title = "联系我们";
		ReactDOM.render(
			<Feedback back={this.back} />,
			document.getElementById("sign-page-wrap")
		);
	},

	gotoMyActivities: function(){
		document.title = "已报名课程";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href + "#myactivities");
		ReactDOM.render(
			<MyActivities back={this.back} gotoActivityDetail={this.gotoActivityDetail}/>,
			document.getElementById("sign-page-wrap")
		);
	},
	gotoMyCollections: function () {
		document.title = "我的收藏";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href + "#collections");
		ReactDOM.render(
			<MyCollections back={this.back} gotoActivityDetail={this.gotoActivityDetail}/>,
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
									<p>已报名课程</p>
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
						</div>
					</div>
				</div>
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});
/*
							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoFeedback}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>联系我们</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>
			<div className="feedback sign-page">
*/

//FIXED ME
var Feedback = React.createClass({
	render: function() {
		return (
			<div className="feedback">
				{(this.props.onlyContact=="1") ? <div ></div>:<div className="back-btn" onClick={this.props.back}>返回</div>}
				<h3>转载文章</h3>
				<p>转载文章请在文中附下图，即视为有效制授权，无需再联系我们</p>
				<p className="qr">
					<img src="/static/img/qrcode_for_gh_1f700e3515dc_258.jpg" alt=""/>
				</p>
				<h3>在线客服</h3>
				<p className="ol-serv">
					点击咨询在线客服
					<a target="_blank" href="http://sighttp.qq.com/authd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb"><img border="0"  src="http://wpa.qq.com/imgd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb&pic=52" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>
				</p>
				<h3>其他合作</h3>
				<p>
					邮箱：<mail>1344671651@qq.com</mail>
				</p>
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
		ev.stopPropagation();
		this.setState({
			signidWantToReset: ev.target.dataset.signid
		});
		ReactDOM.render(
			<ConfirmDialog callback={this.confirmReset} title="取消报名"
				content="您确定要取消该课程的报名吗？"/>,
			document.getElementById("confirm-dialog-wrap")
		);
	},
	confirmReset: function (argument) {
		$.ajax({
			url: ges('activities/reset'),
			//url: '/test/sign.json',
			type: 'post',
			dataType: 'json',
			data: { "openid":geopenid(),"signid": this.state.signidWantToReset },
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
			url: ges('activities/my'),
			//url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
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
					<li onClick={this.props.gotoActivityDetail.bind(this, elem)}
						style={{"cursor": "pointer"}} data-actid={elem.actid}>
						<header className="ss-hd">{elem.title}</header>
						<p className="time clearfix">
							<span>课程时间</span><time>{elem.time_act}</time>
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
			url: ges('activities/mycollections'),
			//url: '/test/my.json',
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
			success: function(res) {
				console.log("mycollections success");
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("mycollections error");
			}.bind(this)
		});
	},

	delCollectionHandler: function (event) {
		event.stopPropagation();
		var collid = event.target.dataset.collid;
		ReactDOM.render(
			<ConfirmDialog callback={function(){
					$.ajax({
						url: ges('activities/reset_collection'),
						//url: '/test/sign.json',
						type: 'post',
						dataType: 'json',
						data: { "openid":geopenid(),"collid": collid },
					})
					.done(function() {
						this.pullFromServer();
					}.bind(this))
					.fail(function() {
						console.log("delCollection error");
					})
					.always(function() {
						console.log("delCollection complete");
						React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
					});
				}.bind(this)} title="删除收藏"
				content="您确定要删除这个收藏吗？"/>,
			document.getElementById("confirm-dialog-wrap")
		);
	},

	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					<li onClick={this.props.gotoActivityDetail.bind(this, elem)}
						style={{"cursor": "pointer"}} data-actid={elem.actid}>
						<header className="ss-hd">{elem.title}</header>
						<p className="time clearfix">
							<span>课程时间</span><time>{elem.time_act}</time>
						</p>
						<button type="button" onClick={this.delCollectionHandler}
							data-uid={index} data-collid={elem.collid} className="weui_btn weui_btn_mini weui_btn_default">
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
