var Me = React.createClass({
	back: function(){
		React.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
		document.title = "我";
	},
	gotoFeedback: function(){
		document.title = "意见反馈";
		ReactDOM.render(
			<Feedback back={this.back}/>, document.getElementById("sign-page-wrap")
		);
	},

	gotoMyActivities: function(){
		document.title = "已报名活动";
		ReactDOM.render(
			<MyActivities back={this.back}/>, document.getElementById("sign-page-wrap")
		);
	},
	render: function() {
		return (
			<div className="me">
				<div className="cell">
					<div className="hd tc">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==" alt=""/>
						<p className="name">张三</p>
					</div>
					<div className="bd">
						<div className="weui_cells weui_cells_access">
							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoMyActivities}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>已报名活动</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>
							<a href="javascript:void(0);" className="weui_cell"
								 onClick={this.gotoFeedback}>
								<div className="weui_cell_bd weui_cell_primary">
									<p>意见反馈</p>
								</div>
								<div className="weui_cell_ft"></div>
							</a>
						</div>
					</div>
				</div>
				<div id="sign-page-wrap"></div>
			</div>
		);
	}
});

var Feedback = React.createClass({
	render: function() {
		return (
			<div className="feedback sign-page">
				<div className="back-btn" onClick={this.props.back}>返回</div>
				<form action="#">

					<input type="hidden" name="uid" value=""/>

					<div className="cell">
						<div className="bd">
							<div className="weui_cells weui_cells_form">
								<div className="weui_cell">
									<div className="weui_cell_bd weui_cell_primary">
										<textarea name="feedback" id="feedback" rows="4" className="weui_textarea" placeholder="请输入反馈意见"></textarea>
									</div>
								</div>
							</div>
							<div className="weui_btn_area">
								<button className="weui_btn weui_btn_primary" type="submit">确定</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
});

var MyActivities = React.createClass({
	getInitialState: function() {
		return {
			activities: []
		};
	},
	signReset: function(ev){
		var uid = ev.target.dataset.uid;
		var signid = ev.target.dataset.signid;
		ReactDOM.render(
			<ConfirmDialog callback={confirmReset} title="取消报名"
				content="您确定要取消该活动的报名吗？"/>,
			document.getElementById("confirm-dialog-wrap")
		);
		function confirmReset(){
			$.ajax({
				url: 'http://121.42.41.241:9900/activities/reset',
				type: 'post',
				dataType: 'json',
				data: { "openid":'9901',"signid":signid },
			})
			.done(function() {
				console.log("success");
				console.log("取消报名成功")
				this.pullFromServer();
			}.bind(this))
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
				React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
			});

		}
	},
	componentDidMount: function() {
	 	this.pullFromServer();
	},
	pullFromServer:function(){
		$.ajax({
			url: 'http://121.42.41.241:9900/activities/my',
			type: 'get',
			dataType: 'json',
			data: { openid:'9901',page:"1",pagesize:"100" },
			success: function(res) {
				console.log("success");
				this.setState( {"activities":res.activities} );
			}.bind(this),
			error: function() {
				console.log("error");
			}.bind(this)
		});
	},
	render: function() {
		var myActivitiesStr = this.state.activities &&
			this.state.activities.map(function(elem, index) {
				return (
					<li>
						<header className="ss-hd">{elem.title}</header>
						<p className="time clearfix">
							<span>活动时间</span><time>{elem.time_act}</time>
						</p>
						<div className="time clearfix">
							<span>报名时间</span><time>{elem.time_signup}</time>
						</div>
						<button type="button" onClick={this.signReset}
							data-uid={index} data-signid={elem.signid} className="weui_btn weui_btn_mini weui_btn_default">
							取消
						</button>
					</li>
				);
			}.bind(this));
		return (
			<div className="myActivities sign-page" style={{"overflow": "auto"}}>
				<div className="back-btn" onClick={this.props.back}>返回</div>
				<div className="cell">
					<ul className="my-activities">
						{myActivitiesStr}
					</ul>
					<div id="confirm-dialog-wrap"></div>
				</div>
			</div>
		);
	}
});

var ConfirmDialog = React.createClass({
	reset: function(){
		React.unmountComponentAtNode(document.getElementById('confirm-dialog-wrap'));
	},
	render: function() {
		return (
			<div className="weui_dialog_confirm" id="confirm-dialog">
		    <div className="weui_mask"></div>
		    <div className="weui_dialog">
	        <div className="weui_dialog_hd">
	        	<strong className="weui_dialog_title">{this.props.title || "提示"}</strong>
	        </div>
	        <div className="weui_dialog_bd">
	        {this.props.content}
	        </div>
	        <div className="weui_dialog_ft">
	            <a href="javascript:;" className="weui_btn_dialog default"
	               onClick={this.reset}>取消</a>
	            <a href="javascript:;" className="weui_btn_dialog primary"
	            	onClick={this.props.callback}>
	            	确定</a>
	        </div>
		    </div>
			</div>
		);
	}
});
