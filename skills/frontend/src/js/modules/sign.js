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
	getInitialState: function() {
		return {
			username: "",
			phone: "",
		};
	},
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
	},
	componentDidMount: function(){
		//load.
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/get_profile',
			type: 'get',
			dataType: 'json',
			data: { "openid":'9901' },
		})
		.done(function(res) {
			console.log("success");
			console.log(res);
			this.setState( { "username":res.profile.username,"phone":res.profile.phone } );
		}.bind(this))
		.fail(function() {
			console.log("error");
		});

		validateForm();
	},
	render: function() {
		return (
			<div className="sign-page">
				<form action="http://121.42.41.241:9900/activities/sign" method="post" id="sign-form">
					<div className="back-btn" onClick={this.back}>返回</div>
					<div className="weui_cells_title">填写报名信息</div>
					<div className="weui_cells weui_cells_form">
						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="name" className="weui_label">真实姓名</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="text" name="name" id="name" className="weui_input"
									placeholder="请输入家长真实姓名" value={this.state.username}/>
							</div>
						</div>
						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="phone" className="weui_label">手机号码</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="number" name="phone" id="phone" className="weui_input"
									placeholder="请输入手机号码" value={this.state.phone}/>
							</div>
						</div>
						<div className="weui_cell">
							<div className="weui_cell_hd">
								<label htmlFor="age" className="weui_label">儿童年龄</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="number" name="age" id="age" className="weui_input"
									placeholder="请输入儿童年龄"/>
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
					<div className="weui_cells_tips">注意事项注意事项注意事项注意事项</div>
					<div className="weui_btn_area">
						<button type="submit" className="weui_btn weui_btn_primary">确定</button>
					</div>
				</form>
				<div id="alert-wrap"></div>
			</div>
		);
	}
});

function validateForm() {
	var actid = getUrlParam("actid");
	if (!isNum(actid)){
		alert("actid must be number.");
		return;
	}
	$("#sign-form").validate({
		rules: {
			"name": {required: true},
			"phone": {required: true, digits: true, rangelength:[11, 11]},
			"age": {required: true, min: 0, max: 99},
			"gender": {required: true}
		},
		messages: {
			name: {required: "必填"},
			phone: {required: "请输入正确的手机号码", digits: "", rangelength: "11位手机号码" },
			age: {required: "请输入年龄", min: "", max: ""},
			gender: {required: "请选择性别"}
		},
		submitHandler: function(form){
			$(form).find(":submit").attr("disabled", true);
			$(form).ajaxSubmit({
				dataType: "json",
				data: { "openid":"9901", "actid":actid },
				success: function(obj){
					//此处加入sdk关闭网页
					obj = typeof obj === "object" ? obj : JSON.parse(obj);
					if (obj.errcode === 0) {
						ReactDOM.render(
							React.createElement(AlertDialog, {
								title: "报名成功",
								msg: "恭喜您报名成功！",
								callback: function(){
									history.back();
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
