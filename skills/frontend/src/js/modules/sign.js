function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
function isNum(s)
{
	if(s!=null){
		var r,re;
		re = /\d*/i; //\d表示数字,*表示匹配多个数字
		r = s.match(re);
		return (r==s)?true:false;
	}
	return false;
}
var Sign = React.createClass({
	back: function(){
		if (this.props.backTitle) {
			document.title = this.props.backTitle;
		}
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
	},
	componentDidMount: function(){

	},
	render: function() {
		return (
			<div className="sign-page">
				<SignForm actid={this.props.actid} back={this.back} reload={this.props.reload}/>
			</div>
		);
	}
});

function validateForm(actid, formConponent) {
	var actid = getUrlParam("actid") || String(actid);
	if (!isNum(actid)){
		alert("actid must be number.");
		return;
	}
	$("#sign-form").validate({
		rules: {
			"name": {required: true},
			"phone": {required: true, digits: true, rangelength:[11, 11]},
			"age": {required: true, min: 0, max: 99},
			"gender": {required: true},
			"city": {required: true},
			"birthdate": {required: true},
			"kids_name": {required: true}
		},
		messages: {
			name: {required: "必填"},
			phone: {required: "请输入正确的手机号码", digits: "", rangelength: "11位手机号码" },
			age: {required: "请输入年龄", min: "", max: ""},
			gender: {required: "请选择性别"},
			city: {required: "请输入所在城市"},
			kids_name: {required: "请输入儿童姓名"},
			birthdate: {required: "请输入儿童出生日期(例:20100101)"}
		},
		submitHandler: function(form){
			$(form).find(":submit").attr("disabled", true);
			$(form).ajaxSubmit({
				dataType: "json",
				data: { "openid":geopenid(), "actid":actid },
				success: function(obj){
					//此处加入sdk关闭网页
					obj = typeof obj === "object" ? obj : JSON.parse(obj);
					if (obj.errcode === 0) {
						ReactDOM.render(
							React.createElement(AlertDialog, {
								title: "报名成功",
								msg: "恭喜您报名成功！",
								callback: function(){
									formConponent.back();
									if (obj.wxchat == ""){
										var r = confirm("现在关注六艺互动的公众号，可以查看更多活动和您的报名情况！");
										if (r){
											try_jump_pubnum();
										}
									}
									//try{
									//	WeixinJSBridge.call('closeWindow');
									//} catch (e){ }
								}
							}),
							document.getElementById("alert-wrap")
						);
					} else {
						alert("报名失败：" + obj.errmsg);
					}
				},
				error: function(xmlHQ, textStatus) {
					alert("服务出错，请稍后重试！");
				},
				complete: function(){
					$(form).find(":submit").attr("disabled", false);
				}
			})
		}
	});
}


var SignForm = React.createClass({
	getInitialState: function() {
		return {
			username: "",
			phone: ""
		};
	},

	back: function(){
		var url = location.pathname;
		if (url.indexOf("activity_detail") != -1) {
			this.props.back();
			this.props.reload();
			setTimeout(function(){
				location.href = "#qrcode";
			}, 500)

		} else {
			window.location = "/template/activity_detail.html?actid=" + this.props.actid;
		}
	},

	componentDidMount:function() {
		validateForm(this.props.actid, this);
	},

	render: function() {
		var ages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		ages = ages.map(function(elem, index) {
			return (
				<option value={elem}>{elem}岁</option>
			);
		});
		var profile = sessionStorage.getItem("_profile");
		if (profile) {
			profile = JSON.parse(profile);
		} else {profile = {}}
		var sign_url = ges("activities/sign");
		return (
			<div className="SignForm">
				<form action={sign_url} method="post" id="sign-form">
					<div className="back-btn" onClick={this.props.back}>返回</div>
					<div className="weui_cells_title">填写报名信息</div>
					<div className="weui_cells weui_cells_form">
						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="name" className="weui_label">真实姓名</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="text" name="name" id="name" className="weui_input"
									placeholder="请输入家长真实姓名" defaultValue={profile.username}/>
							</div>
						</div>
						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="phone" className="weui_label">手机号码</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="number" name="phone" id="phone" className="weui_input"
									placeholder="请输入手机号码" defaultValue={profile.phone}/>
							</div>
						</div>

						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="city" className="weui_label">所在城市</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="text" name="city" id="city" className="weui_input"
									placeholder="请输入所在城市" defaultValue={profile.city}/>
							</div>
						</div>

						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="kids_name" className="weui_label">儿童姓名</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="text" name="kids_name" id="kids_name" className="weui_input"
									placeholder="请输入儿童姓名" defaultValue={profile.kids_name}/>
							</div>
						</div>

						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="birthdate" className="weui_label">儿童出生日期</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="date" name="birthdate" id="birthdate" className="weui_input"
									placeholder="请输入儿童出生日期" defaultValue={profile.birthdate}/>
							</div>
						</div>

						<div className="weui_cell weui_cell_select weui_select_after">
							<div className="weui_cell_hd">
								<label htmlFor="age" className="weui_label">儿童年龄</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<select name="age" id="age" className="weui_select" defautVlaue="1">
									{ages}
								</select>
							</div>
						</div>

					</div>
					<div className="weui_cells_title">儿童性别</div>
					<div className="weui_cells weui_cells_radio">
						<label className="weui_cell weui_check_label" for="x11">
							<div className="weui_cell_bd weui_cell_primary">
									<p>男</p>
							</div>
							<div className="weui_cell_ft">
								<input type="radio" className="weui_check" name="gender"
									value="male" defaultChecked="checked"/>
								<span className="weui_icon_checked"></span>
							</div>
						</label>
						<label className="weui_cell weui_check_label" for="x11">
							<div className="weui_cell_bd weui_cell_primary">
								<p>女</p>
							</div>
							<div className="weui_cell_ft">
								<input type="radio" className="weui_check" name="gender"
									value="female"/>
								<span className="weui_icon_checked"></span>
							</div>
						</label>
					</div>
					<div className="weui_cells_tips"></div>
					<div className="weui_btn_area">

							<button type="submit" className="weui_btn weui_btn_primary">确定</button>

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
			React.unmountComponentAtNode(document.getElementById("alert-wrap"));
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
