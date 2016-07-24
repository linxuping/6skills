var Verify = React.createClass({
	render: function() {
		return (
			<div className="verify">
				<div className="weui_cells_title">验证手机号</div>
				<form action="#">
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
								<a href="#" className="weui_btn weui_btn_mini weui_btn_plain_primary">获取验证码
								</a>
							</div>
						</div>
					</div>
					<div className="weui_cells_tips">注意事项注意事项注意事项</div>
					<div className="weui_btn_area">
						<button type="submit" className="weui_btn weui_btn_primary">
							提交
						</button>
					</div>
				</form>
			</div>
		);
	}
});
