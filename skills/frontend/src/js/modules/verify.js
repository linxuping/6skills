function validateForm() {
	return $("#auth-form").validate({
		rules: {
			"phone": {required: true, digits: true, rangelength:[11, 11]},
			"code": {required: true}
		},
		messages: {
			phone: {required: "请输入正确的手机号码", digits: "", rangelength: "11位手机号码" },
			code: {required: "请输入验证码"}
		},
		submitHandler: function(form){
			$(form).find(":submit").attr("disabled", true);
			$(form).ajaxSubmit({
				dataType: "json",
				data: { "openid":geopenid() },
				success: function(obj){
					//此处加入sdk关闭网页
					obj = typeof obj === "object" ? obj : JSON.parse(obj);
					if (obj.errcode === 0) {
						ReactDOM.render(
							React.createElement(AlertDialog, {
								title: "验证成功",
								msg: "恭喜您验证成功！",
								callback: function(){
									//location.href = ges("template/me.html");
									//try{
									//	WeixinJSBridge.call('closeWindow');
									//} catch (e){ }
									//update profile.
									prostr = sessionStorage.getItem("_profile");
									if (prostr == null) {
										var _profile = [];
										_profile["phone"] = $("#phone").val();
										sessionStorage.setItem("_profile", JSON.stringify(_profile));
										history.back();
										//alert("从服务器获取用户信息失败.");
									}
									else{
										var _profile = JSON.parse(prostr);
										_profile["phone"] = $("#phone").val();
										sessionStorage.setItem("_profile", JSON.stringify(_profile));
										history.back();
									}
								}
							}),
							document.getElementById("alert-wrap")
						);
					} else {
						ReactDOM.render(
							React.createElement(AlertDialog, {
								title: "提示",
								msg: "验证失败：" + obj.errmsg
							}),
							document.getElementById("alert-wrap")
						);
						//alert("验证失败：" + obj.errmsg);
						code.value = "";
					}
				},
				error: function(xmlHQ, textStatus) {
					ReactDOM.render(
						React.createElement(AlertDialog, {
							title: "提示",
							msg: "服务出错，请稍后重试！"
						}),
						document.getElementById("alert-wrap")
					);
					//alert("服务出错，请稍后重试！");
				},
				complete: function(){
					$(form).find(":submit").attr("disabled", false);
				}
			})
		}
	});
}

var Verify = React.createClass({
	verifyHandler: function (ev) {
		if(!this.state.validateForm.element($("#phone"))){
			$("#phone").focus();
			return false;
		}
		var target = $(ev.target);
		if (target.hasClass('weui_btn_disabled')) {
			return false;
		}
		$.ajax({
			url: ges('get-auth-code'),
			//url: '/test/get-auth-code.json',
			type: 'get',
			dataType: 'json',
			data: { "openid":geopenid(), "phone": $("#phone").val()},
		})
		.done(function(res) {
			console.log("success");
			target.addClass('weui_btn_disabled weui_btn_default')
				.removeClass('weui_btn_plain_primary');
			this.countDown(target, 60);
		}.bind(this))
		.fail(function() {
			ReactDOM.render(
				React.createElement(AlertDialog, {
					title: "提示",
					msg: "服务出错，请稍后重试！"
				}),
				document.getElementById("alert-wrap")
			);
		});
	},

	countDown: function(elem, tm) {
		if (tm > 0) {
			elem.text(tm + "s重新发送");
			setTimeout(function(){
				this.countDown(elem, tm - 1);
			}.bind(this), 1000);
		} else {
			elem.text("获取验证码")
				.addClass('weui_btn_plain_primary')
				.removeClass('weui_btn_disabled weui_btn_default');
		}
	},

	componentDidMount: function(){
		this.setState({
			validateForm : validateForm()
		});
	},
	render: function() {
		var wxauth_url = ges("wxauth");
		return (
			<div className="verify">
				<div className="weui_cells_title">验证手机号</div>
				<form action={wxauth_url} method="post" id="auth-form">
					<div className="weui_cells weui_cells_form">
						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label className="weui_label">手机号</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="number" name="phone" id="phone"
									className="weui_input" pattern="[0-9*]"/>
							</div>
						</div>
						<div className="weui_cell weui_cell_vcode">
							<div className="weui_cell_hd">
								<label htmlFor="code" className="weui_label">验证码</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="text" name="code" id="code" className="weui_input"/>
							</div>
							<div className="weui_cell_hd" style={{"marginBottom": "-10px", "marginRight": "0px"}}>
								<a href="#" onClick={this.verifyHandler} className="weui_btn weui_btn_mini weui_btn_plain_primary">获取验证码
								</a>
							</div>
						</div>
					</div>
					<div className="weui_cells_tips"></div>
					<div className="weui_btn_area">
						<button type="submit" className="weui_btn weui_btn_primary">
							提交
						</button>
					</div>
				</form>
				<div id="alert-wrap"></div>
			</div>
		);
	}
});

var AlertDialog = React.createClass({
	confirmHandler: function () {
		if (this.props.callback) {
			this.props.callback();
		} else
			ReactDOM.unmountComponentAtNode(document.getElementById("alert-wrap"));
	},
	render: function() {
		return (
			<div className="weui_dialog_alert" id="alert" ref="alert">
				<div className="weui_mask"></div>
				<div className="weui_dialog">
					<div className="weui_dialog_hd">
						<strong className="weui_dialog_title">{this.props.title && "提示"}</strong>
					</div>
					<div className="weui_dialog_bd">{this.props.msg}</div>
					<div className="weui_dialog_ft">
							<a href="javascript:;" className="weui_btn_dialog primary"
								onClick={this.confirmHandler}>
								确定
							</a>
					</div>
				</div>
			</div>
		);
	}
});
