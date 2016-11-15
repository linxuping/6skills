var Upload = React.createClass({

	getInitialState: function() {
		return {
			name: this.props.name || "images",
			uploading: false
		};
	},
	componentDidMount: function() {
		var qiniu1 = new QiniuJsSDK()
    qiniu1.uploader(uploadConfig({
      key: this.props.uploadKey,
      id: this.props.id || "pickfile",
      name: this.props.name || "images",
      successCallBack: this.successCallBack,
      beforeCallBack: this.beforeCallBack
    }));
	},

	successCallBack: function (file, domain) {
		var fileObj = JSON.parse(file);
		this.setState({
			file: domain + fileObj.key + "?" + new Date().getTime(),
			uploading: false
		});
	},

	beforeCallBack: function(file) {
		this.setState({
			uploading: true
		});
	},

	render: function() {
		return (
			<div className="Upload">
				<div className="weui_cell">
					<div className="weui_cell_bd">
						<input type="hidden" name={this.props.name} value={this.state.file} id={this.props.name}/>
						<div className="weui_uploader">
							<div className="weui_uploader_hd fl">
								<p className="weui_uploader_title" style={{width: 150}}>
									<label htmlFor={this.props.name}>{this.props.label || "选手照片"}</label>
								</p>
							</div>
							<div className="weui_uploader_bd fl">
								<div className="weui_uploader_input_wrp" id={this.props.id || "pickfile"}></div>
								<ul className="weui_uploader_files"
									id="uploaderFiles" style={{float: "left"}}>

									<li className="weui_uploader_file">
										{
											this.state.uploading ?
											<img src="/static/img/loading.gif" style={{width: "100%", height: "100%"}}/>
											:
											<img src={this.state.file} style={{width: "100%", height: "100%"}}/>
										}
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
