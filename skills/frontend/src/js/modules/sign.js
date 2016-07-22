var Sign = React.createClass({
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
	},
	render: function() {
		return (
			<div className="sign-page">
				<form action="" id="sign-form">
					<div className="back-btn" onClick={this.back}>&lt; 返回</div>
					<div className="weui_cells_title">填写报名信息</div>
					<div className="weui_cells weui_cells_form">
						<div className="weui_cell">
							<div className="weui_cell_hd">真实姓名</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="text" name="name" id="" className="weui_input"/>
							</div>
						</div>
						<div className="weui_cell">
							<div className="weui_cell_hd">电话号码</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="number" name="phone" id="" className="weui_input"/>
							</div>
						</div>
						<div className="weui_cell">
							<div className="weui_cell_hd">儿童年龄</div>
							<div className="weui_cell_bd weui_cell_primary">
								<input type="number" name="age" id="" className="weui_input"/>
							</div>
						</div>
					</div>
					<div className="weui_cells_tips">注意事项注意事项注意事项注意事项</div>
					<div className="weui_btn_area">
						<button type="submit" className="weui_btn weui_btn_primary">确定</button>
					</div>
				</form>
			</div>
		);
	}
});
