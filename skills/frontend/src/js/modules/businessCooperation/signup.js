var BusinessCooperation = React.createClass({

  getInitialState:function() {
    return {
      loaded: false,
      component: ""
    };
  },

  componentDidMount:function(){
    this.getBusinessStatus();
  },

  signupAgain: function(){
    this.importUploadComponent();
  },

  getBusinessStatus: function(){
    $.ajax({
      url: '/business/authrization/status',
      type: 'get',
      dataType: 'json',
      data: {openid: geopenid()},
    })
    .done(function(res) {
      if (res.errcode == 0) {
        this.setState({loaded: true});
        // res.status = 3;
        switch(res.status || 0) {
          case 0:
            this.importUploadComponent();
            break;
          case 1:
            this.setState({component: <ApplyPass></ApplyPass>});
            break;
          case 2:
            this.setState({component: <DuringApply></DuringApply>});
            break;
          case 3:
            this.setState({component: <ApplyNotPass signupAgain={this.signupAgain}></ApplyNotPass>});
            break;
        }
      }
    }.bind(this))
    .fail(function() {
      this.setState({
        loaded: true
      });
      this.importUploadComponent()
      console.log("error");
    }.bind(this))
    .always(function() {
      console.log("complete");
    });

  },

  importUploadComponent: function(){
    var uploadJs = [
      '/static/js/upload/moxie.js', '/static/js/upload/plupload.js',
      '/static/js/upload/qiniu.min.js', '/static/js/upload/upload-config.js',
      '/static/js/modules/upload.js'];
    var i = 0;
    for (var i = 0; i < uploadJs.length; i++) {
      var js = document.createElement("script");
      js.type= 'text/javascript';
      js.async = false;
      if (i == 4) {
        js.onreadystatechange = function(){
          if (this.readyState == "complete") {
            this.setState({
              component: <Signup getStatus={this.getBusinessStatus}></Signup>
            });
          }
        }.bind(this);
        js.onload = function() {
          this.setState({
            component: <Signup getStatus={this.getBusinessStatus}></Signup>
          });
        }.bind(this)
      }
      js.src = uploadJs[i];
      document.body.appendChild(js);
    }
  },

  render:function() {

    if (this.state.loaded) {
      return (
        <div className="cooperation">
          {this.state.component}
        </div>
      );
    } else {
      return <Loading loadType="page-loading"></Loading>
    }
  }
});


/**
 * 商户合作申请
 * @param
 */
var Signup = React.createClass({

  getInitialState:function() {
    return {
      hasLicense: 1
    };
  },

  componentDidMount:function(){
    $("#signup-form").validate({
      rules: {
        business: {required: true},
        username: {required: true},
        phone: {required: true, digits: true, rangelength: [11, 11]}
      },
      messages: {
        business: {required: "请输入商户名称"},
        username: {required: "请输入联系人姓名"},
        phone: {
          required: "请输入联系人电话",
          digits: "请输入联系人电话",
          rangelength: "11位手机号码"
        }
      },
      submitHandler: function(form){
        $(form).find(":submit").attr("disabled", true);
        $(form).ajaxSubmit({
          dataType: "json",
          data: { "openid":geopenid() },
          success: function(res){
            if (res.errcode == 0) {
              this.props.getStatus();
            } else {
              alert(res.errmsg);
            }
          }.bind(this),
          error: function() {
            alert("服务出错！请稍后重试！");
          },
          complete: function() {
            $(form).find(":submit").attr("disabled", false);
          }.bind(this)
        })
      }.bind(this)
    })
  },

  licenseChangeHandler: function(e){
    this.setState({hasLicense: e.target.value})
  },

  render:function() {
    return (
      <div className="signup business-page">
        <header className="title">合作申请</header>
        <form action="/business/auth" id="signup-form" method="post">
          <div className="weui_cells_title">是否有营业执照</div>
          <div className="weui_cells weui_cells_radio">
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                  <p>是</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="hasLicense"
                  value="1" defaultChecked="checked" onChange={this.licenseChangeHandler}/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                <p>否</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="hasLicense"
                  value="0" onChange={this.licenseChangeHandler}/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>
          </div>
          <div className="weui_cells weui_cells_form">
            {
              this.state.hasLicense > 0 ?
                <Upload uploadKey="business-img" label="营业执照" name="img_licence"></Upload> :
                <Upload uploadKey="business-img" label="身份证照片" name="img_iden"></Upload>
            }
            {
              this.state.hasLicense > 0 ?
                <div className="weui_cell">
                  <div className="weui_cell_hd">
                    <label htmlFor="business" className="weui_label">商户名称</label>
                  </div>
                  <div className="weui_cell_bd weui_cell_primary">
                    <input type="text" name="business" id="business" className="weui_input"
                      placeholder="请输入商户名称"/>
                  </div>
                </div>
                : ""
            }
            <div className="weui_cell">
              <div className="weui_cell_hd">
                <label htmlFor="username" className="weui_label">联系人姓名</label>
              </div>
              <div className="weui_cell_bd weui_cell_primary">
                <input type="text" name="username" id="username" className="weui_input"
                  placeholder="请输入联系人姓名"/>
              </div>
            </div>

            <div className="weui_cell">
              <div className="weui_cell_hd">
                <label htmlFor="phone" className="weui_label">联系人电话</label>
              </div>
              <div className="weui_cell_bd weui_cell_primary">
                <input type="text" name="phone" id="phone" className="weui_input"
                  placeholder="请输入联系人电话"/>
              </div>
            </div>

          </div>

          <div className="weui_btn_area">
            <button type="submit" className="weui_btn weui_btn_primary" style={{height: 100}}>提交</button>
          </div>

        </form>
      </div>
    );
  }
});

var DuringApply = React.createClass({
  render:function() {
    return (
      <div className="during">
        <header className="title">合作申请</header>
        <div className="weui_msg">
          <div className="weui_icon_area"><i className="weui_icon_waiting weui_icon_msg"></i></div>
          <div className="weui_text_area">
            <h2 className="weui_msg_title">申请中</h2>
            <p className="weui_msg_desc">
              您的合作申请正在处理中，请耐心等待结果。
            </p>
          </div>
        </div>
      </div>
    );
  }
});

var ApplyPass = React.createClass({
  render:function() {
    return (
      <div className="during">
        <header className="title">合作申请</header>
        <div className="weui_msg">
          <div className="weui_icon_area"><i className="weui_icon_success weui_icon_msg"></i></div>
          <div className="weui_text_area">
            <h2 className="weui_msg_title">申请成功</h2>
            <p className="weui_msg_desc">
              您的合作申请已通过，恭喜您。您现在可以联系我们的客服上传课程和活动了。
            </p>
          </div>
        </div>
      </div>
    );
  }
});

var ApplyNotPass = React.createClass({
  render:function() {
    return (
      <div className="during">
        <header className="title">合作申请</header>
        <div className="weui_msg">
          <div className="weui_icon_area"><i className="weui_icon_cancel weui_icon_msg"></i></div>
          <div className="weui_text_area">
            <h2 className="weui_msg_title">申请失败</h2>
            <p className="weui_msg_desc">
              您的合作申请未通过，请上传清晰的营业证照片或身份证照片。
            </p>
          </div>
          <div className="weui_extra_area" onClick={this.props.signupAgain}>
            <a href="javascript:;">重新申请</a>
          </div>
        </div>
      </div>
    );
  }
});


var Loading = React.createClass({
  render:function() {
    return (
      <div className={this.props.loadType || "page-loading"}>
        <img src="/static/img/loading.gif" alt=""/>
      </div>
    );
  }
});
