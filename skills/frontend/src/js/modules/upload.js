var Upload = React.createClass({

	getInitialState: function() {
		return {
			name: "images"
		};
	},
	componentDidMount: function() {
		var qiniu1 = new QiniuJsSDK()
    qiniu1.uploader(uploadConfig({
      key: this.props.uploadKey,
      id: this.props.id || "pickfile",
      name: this.props.name || "images",
      successCallBack: this.successCallBack
    }));
	},

	successCallBack: function (file, domain) {
		let fileObj = JSON.parse(file);
		this.setState({
			file: domain + fileObj.key + "?" + new Date().getTime()
		});
	},

	render: function() {
		return (
			<div className="Upload">
				<div className="weui_cell">
					<div className="weui_cell_bd">
						<input type="hidden" name={this.state.name} value={this.state.file}/>
						<div className="weui_uploader">
							<div className="weui_uploader_hd fl">
								<p className="weui_uploader_title" style={{width: 105}}>照片</p>
							</div>
							<div className="weui_uploader_bd fl">
								<div className="weui_uploader_input_wrp" id={this.props.id || "pickfile"}></div>
								<ul className="weui_uploader_files"
									id="uploaderFiles" style={{float: "left"}}>

									<li className="weui_uploader_file">
										<img src={this.state.file} style={{width: "100%", height: "100%"}}/>
									</li>

								</ul>

							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
