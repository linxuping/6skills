var Sign = React.createClass({displayName: "Sign",
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
	},
	render: function() {
		return (
			React.createElement("div", {className: "sign-page"}, 
				React.createElement("form", {action: "", id: "sign-form"}, 
					React.createElement("div", {className: "back-btn", onClick: this.back}, "返回"), 
					React.createElement("div", {className: "weui_cells_title"}, "填写报名信息"), 
					React.createElement("div", {className: "weui_cells weui_cells_form"}, 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "name", className: "weui_label"}, "真实姓名")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "text", name: "name", id: "", className: "weui_input"})
							)
						), 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "phone", className: "weui_label"}, "电话号码")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "number", name: "phone", id: "", className: "weui_input"})
							)
						), 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "age", className: "weui_label"}, "儿童年龄")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "number", name: "age", id: "", className: "weui_input"})
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
								React.createElement("input", {type: "radio", className: "weui_check", name: "gender"}), 
								React.createElement("span", {className: "weui_icon_checked"})
							)
						), 
						React.createElement("label", {className: "weui_cell weui_check_label", for: "x11"}, 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
									React.createElement("p", null, "女")
							), 
							React.createElement("div", {className: "weui_cell_ft"}, 
								React.createElement("input", {type: "radio", className: "weui_check", name: "gender"}), 
								React.createElement("span", {className: "weui_icon_checked"})
							)
						)
					), 
					React.createElement("div", {className: "weui_cells_tips"}, "注意事项注意事项注意事项注意事项"), 
					React.createElement("div", {className: "weui_btn_area"}, 
						React.createElement("button", {type: "submit", className: "weui_btn weui_btn_primary"}, "确定")
					)
				)
			)
		);
	}
});
