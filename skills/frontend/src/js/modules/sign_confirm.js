var SignConfirm = React.createClass({

  PropTypes: {
    mountnode: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      loaded: false
    };
  },

  back: function(){
    if (this.props.mountnode) {
      ReactDOM.unmountComponentAtNode(document.getElementById(this.props.mountnode));
    } else {
      ReactDOM.unmountComponentAtNode(document.getElementById('alert-wrap'));
    }

  },

  componentDidMount: function() {
    if (this.props.signid) {
      this.getSignMsg();
    }
  },


  submitHandler: function(e){
    var formConponent = this.props.formConponent;
    $(e.target).attr("disabled", true);
    $(this.props.form).ajaxSubmit({
     dataType: "json",
     data: { "openid":geopenid(), "actid": formConponent.props.actid },
     success: function(obj){
       //此处加入sdk关闭网页
       obj = typeof obj === "object" ? obj : JSON.parse(obj);
       if (obj.errcode === 0) {
         if (formConponent.props.activity.price_child > 0) {
           //费用不为0，交费
           var major = $("#major");
           if (major) {
             major = major.val();
           }
           //把报名页面关掉
           formConponent.back();
           document.title = "付款";
           ReactDOM.render(
             <Pay activity={formConponent.props.activity} major={major} backTitle="活动详情"/>,
             document.getElementById("pay-page-wrap")
           )
         } else {
           //免费直接报名成功
           ReactDOM.render(
             React.createElement(AlertDialog, {
               title: "报名成功",
               msg: "恭喜您报名成功！",
               callback: function(){
                 if (obj.wxchat == ""){
                   var r = confirm("现在关注爱试课的公众号，可以查看更多活动和您的报名情况！");
                   if (r){
                     try_jump_pubnum();
                   }
                 }
                 //修改的回到报名信息页
                 if (formConponent.props.isVerify) {
                  ReactDOM.unmountComponentAtNode(document.getElementById('sign-page-wrap'));
                  formConponent.props.updateSignInfo();
                 } else {
                   //否则回到详情
                   formConponent.back();
                 }

               }
             }),
             document.getElementById("alert-wrap")
           );
         }

       } else {
         alert("报名失败：" + obj.errmsg);
       }
     },
     error: function(xmlHQ, textStatus) {
       alert("服务出错，请稍后重试！");
     },
     complete: function(){
       $(e.target).attr("disabled", false);
     }.bind(this)
    })
  },


  render:function() {

    var datas = decodeURIComponent($(this.props.form).serialize()).split("&");

    return (
      <div className="sign-confirm sign-page" style={{overflowY: "auto"}}>
        <div className="back-btn" onClick={this.back}>报名信息确认</div>
        <div className="weui_cells_title">报名信息确认</div>
        <div className="weui_cells">
          {
            datas.map(function(item, idx){
              var data = item.split("=");
              var name = $("label[for='" + data[0] + "']").text();
              if (name == "") {
                switch(data[0]){
                  case "gender":
                    name = "选手性别";
                    break;
                  case "awards":
                    name = "获奖经历";
                    break;
                }
              }
              var value = data[1];
              if (data[0] == "images") {
                value = <img src={data[1]} style={{width: 120, height: 120}}/>
              } else if (data[0] == "gender") {
                var genders = {"male": "男", "female": "女"};
                value = genders[data[1]];
              }
              return (
                  <div className="weui_cell" key={idx}>
                    <div className="weui_cell_bd weui_cell_primary"
                      style={{minWidth: 120}}>
                      <p>{name}</p>
                    </div>
                    <div className="weui_cell_ft">{value}</div>
                  </div>
                )
            })
          }

        </div>
        <div className="weui_btn_area">
          <button type="button" style={{height: 100}} onClick={this.submitHandler}
              className="weui_btn weui_btn_primary mb15 mt10">
              确定
          </button>
        </div>
      </div>
    );
  }
});
