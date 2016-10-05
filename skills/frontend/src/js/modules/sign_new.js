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
			<div className="sign-page" style={{"overflowY": "auto"}}>
				<SignForm actid={this.props.actid} back={this.back} 
					reload={this.props.reload} activity={this.props.activity}/>
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
			"kids_name": {required: true},
			"identity_card": {required: true, rangelength: [18, 18]},
			"program": {required: true},
			"company": {required: true},
			"teacher": {required: true},
			"company_tel": {required: true},
			"teacher_phone": {required: true, digits: true, rangelength:[11, 11]},
			"birthdate": {required: true}
		},
		messages: {
			"name": {required: "必填"},
			"phone": {required: "请输入正确的手机号码", digits: "", rangelength: "11位手机号码" },
			"age": {required: "请输入年龄", min: "", max: ""},
			"gender": {required: "请选择宝宝性别"},
			"city": {required: "请输入所在城市"},
			"kids_name": {required: "请输入宝宝姓名"},
			"identity_card": {required: "请输入身份证号", rangelength: "18位身份证"},
			"program": {required: "请输入节目名称"},
			"company": {required: "请输入选送单位"},
			"teacher": {required: "请输入指导老师"},
			"company_tel": {required: "请输入单位电话"},
			"teacher_phone": {required: "请输入老师电话", digits: "11位手机号码", rangelength:"11位手机号码"},
			birthdate: {required: "请输入宝宝出生日期(例:20100101)"}
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
									if (formConponent.props.activity.price_child > 0) {
										var major = $("#major");
										if (major) {
											major = major.val();
										}
									  ReactDOM.render(
									    <Pay activity={formConponent.props.activity} major={major}/>,
									    document.getElementById("pay-page-wrap")
									  )
									} else {
										if (obj.wxchat == ""){
											var r = confirm("现在关注爱试课的公众号，可以查看更多活动和您的报名情况！");
											if (r){
												try_jump_pubnum();
											}
										}
									}
									formConponent.back();
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
		var age;
		if (this.props.signtype == "3") {
			ages = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		} else {
			ages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		}
		
		ages = ages.map(function(elem, index) {
			return (
				<option key={index} value={elem}>{elem}岁</option>
			);
		});
		var profile = sessionStorage.getItem("_profile");
		if (profile) {
			profile = JSON.parse(profile);
		} else {profile = {}}
		var sign_url = ges("activities/sign");

		var matchClasses = ["幼儿组（学龄前）", "小学甲组（1—2年级）", "小学乙组（3—4年级）", "小学丙组（5—6年级）"];
		matchClasses = matchClasses.map(function(elem, index){
			return <option key={index} value={elem}>{elem}</option>
		});
		var majors = ["声乐", "器乐", "舞蹈", "语言", "书画"];
		majors = majors.map(function(elem, index) {
			return (
				<option key={index} value={elem}>{elem}</option>
			);
		})
		var signtype = this.props.activity.sign_type;
		return (
			<div className="SignForm">
				<form action={sign_url} method="post" id="sign-form">
					<div className="back-btn" onClick={this.props.back}>报名</div>
					<div className="weui_cells_title" style={{marginTop: 0}}>填写报名信息</div>
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

						{
							signtype == "2" ? 
							<div>
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
										<label htmlFor="kids_name" className="weui_label">宝宝姓名</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="kids_name" id="kids_name" className="weui_input"
											placeholder="请输入宝宝姓名" defaultValue={profile.kids_name}/>
									</div>
								</div>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="birthdate" className="weui_label">宝宝出生日期</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="date" name="birthdate" id="birthdate" className="weui_input"
											placeholder="请输入儿童出生日期" defaultValue={profile.birthdate}/>
									</div>
								</div>
							</div>
							: ""
						}

						{
							signtype == "3" ? 
							<div className="weui_cell">
								<div className="weui_cell_hd">
									<label htmlFor="kids_name" className="weui_label">宝宝姓名</label>
								</div>
								<div className="weui_cell_bd weui_cell_primary">
									<input type="text" name="kids_name" id="kids_name" className="weui_input"
										placeholder="请输入宝宝姓名" defaultValue={profile.kids_name}/>
								</div>
							</div> : ""
						}

						<div className="weui_cell weui_cell_select weui_select_after">
							<div className="weui_cell_hd">
								<label htmlFor="age" className="weui_label">宝宝年龄</label>
							</div>
							<div className="weui_cell_bd weui_cell_primary">
								<select name="age" id="age" className="weui_select" defautVlaue="1">
									{ages}
								</select>
							</div>
						</div>

					</div>
					<div className="weui_cells_title">宝宝性别</div>
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


					{
						signtype == "3" ? 
						<div>
							<div className="weui_cells weui_cells_form">

								<Upload uploadKey="custom-sign"></Upload>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="identity_card" className="weui_label">身份证号</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="identity_card" id="identity_card" className="weui_input"
											placeholder="请输入身份证号" defaultValue={profile.identity_card}/>
									</div>
								</div>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="program" className="weui_label">节目名称</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="program" id="program" className="weui_input"
											placeholder="请输入节目名称" defaultValue={profile.program}/>
									</div>
								</div>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="company" className="weui_label">选送单位</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="company" id="company" className="weui_input"
											placeholder="请输入选送单位" defaultValue={profile.company}/>
									</div>
								</div>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="company_tel" className="weui_label">单位电话</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="company_tel" id="company_tel" className="weui_input"
											placeholder="请输入单位电话" defaultValue={profile.company_tel}/>
									</div>
								</div>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="teacher" className="weui_label">指导老师</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="teacher" id="teacher" className="weui_input"
											placeholder="请输入指导老师姓名" defaultValue={profile.teach}/>
									</div>
								</div>

								<div className="weui_cell">
									<div className="weui_cell_hd">
										<label htmlFor="teacher_phone" className="weui_label">老师电话</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<input type="text" name="teacher_phone" id="teacher_phone" className="weui_input"
											placeholder="请输入老师电话" defaultValue={profile.teacher_phone}/>
									</div>
								</div>

								<div className="weui_cell weui_cell_select weui_select_after">
									<div className="weui_cell_hd">
										<label htmlFor="match_class" className="weui_label">参赛组别</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<select name="match_class" id="match_class" className="weui_select" defautVlaue="1">
											{matchClasses}
										</select>
									</div>
								</div>
								<div className="weui_cell weui_cell_select weui_select_after">
									<div className="weui_cell_hd">
										<label htmlFor="major" className="weui_label">参赛专业</label>
									</div>
									<div className="weui_cell_bd weui_cell_primary">
										<select name="major" id="major" className="weui_select" ref="major">
											{majors}
										</select>
									</div>
								</div>
							</div>

							<div className="weui_cells_title">获奖经历</div>
							<div className="weui_cells weui_cells_form">
								<div className="weui_cell">
									<div className="weui_cell_bd" style={{width: "100%"}}>
										<textarea name="awards" id="awards" rows="3" className="weui_textarea"
											placeholder="获奖经历"></textarea>
									</div>
								</div>
							</div>
						</div> 
						:
						""
					}

					<div className="weui_btn_area mb20">
						<button type="submit" className="weui_btn weui_btn_primary" >确定</button>
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
