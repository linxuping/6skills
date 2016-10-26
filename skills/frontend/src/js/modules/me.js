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
			} else if ("activities-to-pay".indexOf(hash) !== -1) {
        this.gotoNotPayActivities();
      } else if ("activities-withdraw".indexOf(hash) !== -1) {
				this.gotoWithdrawActivities();
			}
		}
	},

	back: function(){
		ReactDOM.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
		document.title = "我的课程";
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

	gotoNotPayActivities: function() {
	  document.title = "待付款";
	  var href = window.location.href.split("#")[0];
	  history.replaceState("myActivities", null, href + "#activities-to-pay");
	  ReactDOM.render(
	  	<ActivitiesToPay back={this.back} gotoActivityDetail={this.gotoActivityDetail}/>,
	  	document.getElementById("sign-page-wrap")
	  );
	},

	gotoWithdrawActivities: function(){
		document.title = "退款";
		var href = window.location.href.split("#")[0];
		history.replaceState("myActivities", null, href + "#activities-withdraw");
		ReactDOM.render(
			<ActivitiesWithdraw back={this.back} gotoActivityDetail={this.gotoActivityDetail}/>,
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

							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoNotPayActivities}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>待付款</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>

							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoWithdrawActivities}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>申请退款</p>
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
				<div style={{margin:'4px'}}><font style={{fontSize:'32px'}}>转载文章</font></div>
				<p style={{fontSize:'24px'}}>转载文章请在文中附下图，即视为有效授权，无需再联系我们</p>
				<p className="qr">
					<img src="/static/img/qrcode_for_gh_1f700e3515dc_258.jpg" alt=""/>
				</p>
				<div style={{margin:'4px'}}><font style={{fontSize:'32px'}}>在线客服</font></div>
				<p style={{fontSize:'24px'}} className="ol-serv">
					点击咨询在线客服
					<a target="_blank" href="http://sighttp.qq.com/authd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb"><img border="0"  src="http://wpa.qq.com/imgd?IDKEY=e482769a89f979b33df8b6856321444d4dbc1dceccb270cb&pic=52" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>
				</p>
				<div style={{margin:'4px'}}><font style={{fontSize:'32px'}}>其他合作</font></div>
				<p style={{fontSize:'24px'}}>
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
			ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
			alert("报名已成功删除，如需退款请到申请退款页面中发起!")
			this.pullFromServer();
		}.bind(this))
		.fail(function() {
			console.log("error");
			ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
		})
		.always(function() {
			console.log("complete");
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
			//url: '/static/js/test/list.js',
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
			success: function(res) {
				console.log("mycollections success");
				//res = JSON.parse(res)
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("mycollections error");
			}.bind(this)
		});
	},

	delCollectionHandler: function (event) {
		var _this = this;
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
						ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
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

var ActivitiesToPay = React.createClass({
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
			url: ges('activities/unpay/list'),
			//url: "/static/js/test/list.js",
			type: 'get',
			dataType: 'json',
			data: { openid:geopenid(),page:"1",pagesize:"100" },
			success: function(res) {
				console.log("unpay list success");
				res = typeof res == "object" ? res : JSON.parse(res);
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("unpay list error");
			}.bind(this)
		});
	},

	gotoPayPage: function(activity) {
		document.title = "付款";
	  ReactDOM.render(
	    <Pay activity={activity} backTitle="待付款" major={activity.major} price={activity.price}/>,
	    document.getElementById("pay-page-wrap")
	  )
	},

	delunPayActivity: function (e) {
		e.stopPropagation();
		var signid = e.target.dataset.id;
		console.log(signid);
		ReactDOM.render(
			<ConfirmDialog callback={function(){
					$.ajax({
						url: "/activities/reset",
						//url: '/test/sign.json',
						type: 'post',
						dataType: 'json',
						data: { "openid":geopenid(), "signid": signid},
					})
					.done(function(res) {
						if (res.errcode == 0) {
							this.pullFromServer();
						} else {
							alert(res.errmsg);
						}
					}.bind(this))
					.fail(function() {
						console.log("delCollection error");
					})
					.always(function() {
						console.log("delCollection complete");
						ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
					});
				}.bind(this)} title="取消报名"
				content="您确定要取消这个报名吗？"/>,
			document.getElementById("confirm-dialog-wrap")
		);
	},

	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					<li onClick={this.gotoPayPage.bind(this, elem)}
						style={{"cursor": "pointer"}} key={index}>
						<header className="ss-hd">{elem.title}</header>
						<p className="time clearfix">
							<span>课程时间</span><time>{elem.time_signup}</time>
						</p>
						<button type="button" onClick={this.delunPayActivity}
							data-id={elem.signid} className="weui_btn weui_btn_mini weui_btn_default">
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

/**
 * 退款列表
 * return
 */
var ActivitiesWithdraw = React.createClass({
	getInitialState: function() {
		return {
			activities: []
		};
	},
	signReset: function(ev){
		ev.stopPropagation();
		var pid = ev.target.dataset.pid;
		var status = ev.target.dataset.status;
		if (status > 1)
			return;
		ReactDOM.render(
			<WithdrawPage pid={pid} updateActivities={this.pullFromServer}/>,
			document.getElementById("confirm-dialog-wrap")
		)
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
			ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
			alert("请耐心等候退款申请！")
			this.pullFromServer();
		}.bind(this))
		.fail(function() {
			console.log("error");
			ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
		})
		.always(function() {
			console.log("complete");
		});
	},

	componentDidMount: function() {
	 	this.pullFromServer();
	},

  //FIX ME
  //url is not right
	pullFromServer:function(){
		$.ajax({
			url: ges('activities/pay/list'),
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
							<span>课程时间</span><time>{elem.time}</time>
						</p>
						<button type="button" onClick={this.signReset}
							data-uid={index} data-pid={elem.pid} data-status={elem.status} className="weui_btn weui_btn_mini weui_btn_default">
							{(elem.status==2) ? "等待退款":((elem.status==3) ? "已退款":"申请退款")}
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


/**
 * 退款页面
 * @return
 */
var WithdrawPage = React.createClass({

  back: function(){
    this.props.updateActivities();
    ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
  },

  submitHandler: function(e){
    var form = $("#withdraw-form");
    var reason = $("input[name='reason']:checked").val();
    if (reason.indexOf("其他原因") != -1){
      reason = $("#other_reason")[0].value;
    }
    //var other_reason = $("#other_reason");
    $.ajax({
      url: ges('activities/pay/refund'),
      type: 'post',
      dataType: 'json',
      data: {
        reason: reason,
        openid: geopenid(),
        pid: this.props.pid
      },
    })
    .done(function(res) {
      console.log("success");
      if (res.errcode == 0) {
        alert("申请成功，款项将在3个工作日内退到您的微信账户里！");
        this.back();
      } else {
        alert("退款申请失败:" + res.errmsg);
      }
    }.bind(this))
    .fail(function(res) {
      alert("服务出错，请稍后重试！")
    })
    .always(function() {
      console.log("complete");
    });

  },

	render: function() {
		return (
			<div className="withdraw-page sign-page">
        <div className="back-btn" onClick={this.back}>返回</div>
        <form action="#" method="post" id="withdraw-form">
          <div className="weui_cells_title">退款原因</div>
            <div className="weui_cells weui_cells_radio">
              <label className="weui_cell weui_check_label" for="x11">
                <div className="weui_cell_bd weui_cell_primary">
                  <p>没时间参加</p>
                </div>
                <div className="weui_cell_ft">
                  <input type="radio" className="weui_check" name="reason"
                    value="没时间参加" defaultChecked="checked"/>
                  <span className="weui_icon_checked"></span>
                </div>
              </label>
              <label className="weui_cell weui_check_label" for="x11">
                <div className="weui_cell_bd weui_cell_primary">
                  <p>无理由退款</p>
                </div>
                <div className="weui_cell_ft">
                  <input type="radio" className="weui_check" name="reason"
                    value="无理由退款"/>
                  <span className="weui_icon_checked"></span>
                </div>
              </label>
              <label className="weui_cell weui_check_label" for="x11">
                <div className="weui_cell_bd weui_cell_primary">
                  <p>其他原因，请在下方输入</p>
                </div>
                <div className="weui_cell_ft">
                  <input type="radio" className="weui_check" name="reason"
                    value="其他原因，请在下方输入"/>
                  <span className="weui_icon_checked"></span>
                </div>
              </label>

              <div className="weui_cell">
                <div className="weui_cell_bd" style={{width: "100%"}}>
                  <textarea name="other_reason" id="other_reason" rows="3" className="weui_textarea"
                    placeholder="退款原因"></textarea>
                </div>
              </div>
            </div>
            <div className="weui_btn_area mb20"
              style={{position: "absolute", width: "100%", padding: 10, margin: 0, bottom: 0}}>
              <button type="button" className="weui_btn weui_btn_primary"
                style={{height: 100}} onClick={this.submitHandler.bind(this)}>
                提交
              </button>
            </div>
        </form>

			</div>
		);
	}
});


var ConfirmDialog = React.createClass({
	reset: function(){
		ReactDOM.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
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
