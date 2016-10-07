var Upload = React.createClass({displayName: "Upload",

	getInitialState: function() {
		return {
			name: "images"
		};
	},
	componentDidMount: function() {
		try{


		var qiniu1 = new QiniuJsSDK()
    qiniu1.uploader(uploadConfig({
      key: this.props.uploadKey,
      id: this.props.id || "pickfile",
      name: this.props.name || "images",
      successCallBack: this.successCallBack
    }));
  } catch(e){
  	alert(e)
  }
	},

	successCallBack: function (file, domain) {
		var fileObj = JSON.parse(file);
		this.setState({
			file: domain + fileObj.key + "?" + new Date().getTime()
		});
	},

	render: function() {
		return (
			React.createElement("div", {className: "Upload"}, 
				React.createElement("div", {className: "weui_cell"}, 
					React.createElement("div", {className: "weui_cell_bd"}, 
						React.createElement("input", {type: "hidden", name: this.state.name, value: this.state.file, id: this.state.name}), 
						React.createElement("div", {className: "weui_uploader"}, 
							React.createElement("div", {className: "weui_uploader_hd fl"}, 
								React.createElement("p", {className: "weui_uploader_title", style: {width: 105}}, "宝宝照片")
							), 
							React.createElement("div", {className: "weui_uploader_bd fl"}, 
								React.createElement("div", {className: "weui_uploader_input_wrp", id: this.props.id || "pickfile"}), 
								React.createElement("ul", {className: "weui_uploader_files", 
									id: "uploaderFiles", style: {float: "left"}}, 

									React.createElement("li", {className: "weui_uploader_file"}, 
										React.createElement("img", {src: this.state.file, style: {width: "100%", height: "100%"}})
									)

								)

							)
						)
					)
				)
			)
		);
	}
});
