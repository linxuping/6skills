var Verify = React.createClass({displayName: "Verify",
	render: function() {
		return (
			React.createElement("div", {className: "verify"}, 
				React.createElement("div", {className: "weui_cells_title"}, "验证手机号"), 
				React.createElement("form", {action: "#"}, 
					React.createElement("div", {className: "weui_cells weui_cells_form"}, 
						React.createElement("div", {className: "weui_cell"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {className: "weui_label"}, "手机号")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "number", name: "phone", id: "phone", 
									className: "weui_input", pattern: "[0-9*]"})
							)
						), 
						React.createElement("div", {className: "weui_cell weui_cell_vcode"}, 
							React.createElement("div", {className: "weui_cell_hd"}, 
								React.createElement("label", {htmlFor: "code", className: "weui_label"}, "验证码")
							), 
							React.createElement("div", {className: "weui_cell_bd weui_cell_primary"}, 
								React.createElement("input", {type: "text", name: "code", id: "code", className: "weui_input"})
							), 
							React.createElement("div", {className: "weui_cell_hd", style: {"marginBottom": "-10px", "marginRight": "0px"}}, 
								React.createElement("a", {href: "#", className: "weui_btn weui_btn_mini weui_btn_plain_primary"}, "获取验证码"
								)
							)
						)
					), 
					React.createElement("div", {className: "weui_cells_tips"}, "注意事项注意事项注意事项"), 
					React.createElement("div", {className: "weui_btn_area"}, 
						React.createElement("button", {type: "submit", className: "weui_btn weui_btn_primary"}, 
							"提交"
						)
					)
				)
			)
		);
	}
});
