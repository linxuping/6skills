var Sign = React.createClass({displayName: "Sign",
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
	},
	componentDidMount: function(){
		validateForm();
	},
	render: function() {
		return (
			React.createElement("div", {className: "sign-page"}, 
				React.createElement("form", {action: "/test/sign.json", method: "get", id: "sign-form"}, 
					React.createElement("div", {className: "back-btn", onClick: this.back}, "返回"), 
					React.createElement("div", {className: "weui_cells_title"}, "填写报名信息"), 
					React.createElement("div", {className: "weui_cells weui_cells_form"}, 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "name", className: "weui_label"}, "真实姓名")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "text", name: "name", id: "name", className: "weui_input", 
									placeholder: "请输入家长真实姓名"})
							)
						), 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "phone", className: "weui_label"}, "手机号码")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "number", name: "phone", id: "phone", className: "weui_input", 
									placeholder: "请输入手机号码"})
							)
						), 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "age", className: "weui_label"}, "儿童年龄")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "number", name: "age", id: "age", className: "weui_input", 
									placeholder: "请输入儿童年龄"})
							)
						)

					), 
					React.createElement("div", {className: "weui_cells_title"}, "儿童性别"), 
					React.createElement("div", {className: "weui_cells weui_cells_radio"}, 
						React.createElement("label", {className: "weui_cell weui_check_label", for: "x11"}, 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "男")
							), 
							React.createElement("div", {className: "weui_cell_ft"}, 
								React.createElement("input", {type: "radio", className: "weui_check", name: "gender", 
									value: "male", defaultChecked: "checked"}), 
								React.createElement("span", {className: "weui_icon_checked"})
							)
						), 
						React.createElement("label", {className: "weui_cell weui_check_label", for: "x11"}, 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "女")
							), 
							React.createElement("div", {className: "weui_cell_ft"}, 
								React.createElement("input", {type: "radio", className: "weui_check", name: "gender", 
									value: "female"}), 
								React.createElement("span", {className: "weui_icon_checked"})
							)
						)
					), 
					React.createElement("div", {className: "weui_cells_tips"}, "注意事项注意事项注意事项注意事项"), 
					React.createElement("div", {className: "weui_btn_area"}, 
						React.createElement("button", {type: "submit", className: "weui_btn weui_btn_primary"}, "确定")
					)
				), 
				React.createElement("div", {id: "alert-wrap"})
			)
		);
	}
});

function validateForm() {
	$("#sign-form").validate({
		rules: {
			"name": {required: true},
			"phone": {required: true, digits: true, rangelength:[11, 11]},
			"age": {required: true, min: 0, max: 99},
			"gender": {required: true}
		},
		messages: {
			name: {required: ""},
			phone: {required: "", digits: "", rangelength: ""},
			age: {required: "", min: "", max: ""},
			gender: {required: ""}
		},
		submitHandler: function(form){
			$(form).find(":submit").attr("disabled", true);
			$(form).ajaxSubmit({
				dataType: "json",
				success: function(obj){
					//此处加入sdk关闭网页
					obj = typeof obj === "object" ? obj : JSON.parse(obj);
					if (obj.errcode === 0) {
						ReactDOM.render(
							React.createElement(AlertDialog, {
								title: "报名成功",
								msg: "恭喜您报名成功！",
								callback: function(){
									try{
										WeixinJSBridge.call('closeWindow');
									} catch (e){

									}
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

var AlertDialog = React.createClass({displayName: "AlertDialog",
	confirmHandler: function () {
		if (this.props.callback) {
			this.props.callback();
		} else
			React.unmountComponentAtNode(document.getElementById("alert-wrap"));
	},
	render: function() {
		return (
			React.createElement("div", {className: "weui_dialog_alert", id: "alert", ref: "alert"}, 
				React.createElement("div", {className: "weui_mask"}), 
				React.createElement("div", {className: "weui_dialog"}, 
					React.createElement("div", {className: "weui_dialog_hd"}, 
						React.createElement("strong", {className: "weui_dialog_title"}, this.props.title && "提示")
					), 
					React.createElement("div", {className: "weui_dialog_bd"}, this.props.msg), 
					React.createElement("div", {className: "weui_dialog_ft"}, 
							React.createElement("a", {href: "javascript:;", className: "weui_btn_dialog primary", 
								onClick: this.confirmHandler}, 
								"确定"
							)
					)
				)
			)
		);
	}
});
