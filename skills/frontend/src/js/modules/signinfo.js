var Signupinfo = React.createClass({

  PropTypes: {
    mountnode: React.PropTypes.string,
    signid: React.PropTypes.number
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

    injectScript("/static/js/modules/sign_new.js");
    injectScript('/static/js/jquery.validate.min.js');
    injectScript('/static/js/jquery.form.min.js');

  },

  verifyHandler: function(){
    ReactDOM.render(
      <Sign activity={this.state.signinfo} actid={this.state.signinfo.actid} isVerify={true} updateSignInfo={this.getSignMsg}></Sign>,
      document.getElementById('sign-page-wrap')
    )
  },

  getSignMsg: function(){
    $.ajax({
      url: ges('signupinfo/get'),
      type: 'get',
      dataType: 'json',
      data: {openid: geopenid(), signid: this.props.signid}
    })
    .done(function(res) {
      console.log("success");
      if (res.errcode == 0) {
        this.setState({
          loaded: true,
          signinfo: res
        });
      } else {
        alert("获取信息失败:" + res.errmsg);
      }
    }.bind(this))
    .fail(function(xmlHttpReq) {
      console.log(xmlHttpReq);
      alert("服务出错，请稍后重试！")
    })
    .always(function() {
      console.log("complete");
    });

  },

  render: function() {
    if (this.state.loaded) {
      var info = this.state.signinfo || {};
      return (
        <div className="sign-confirm sign-page" style={{overflowY: "auto"}}>
          <div className="back-btn" onClick={this.back}>报名信息</div>
          <div className="weui_cells_title">报名信息</div>
          <div className="weui_cells">

            <div className="weui_cell">
              <div className="weui_cell_bd weui_cell_primary"
                style={{minWidth: 120}}>
                <p>家长姓名</p>
              </div>
              <div className="weui_cell_ft">{info.username_pa}</div>
            </div>

            {
              info.kids_name ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>选手姓名</p>
                </div>
                <div className="weui_cell_ft">{info.kids_name}</div>
              </div> : ""
            }

            <div className="weui_cell">
              <div className="weui_cell_bd weui_cell_primary"
                style={{minWidth: 120}}>
                <p>手机号码</p>
              </div>
              <div className="weui_cell_ft">{info.phone}</div>
            </div>
            <div className="weui_cell">
              <div className="weui_cell_bd weui_cell_primary"
                style={{minWidth: 120}}>
                <p>选手性别</p>
              </div>
              <div className="weui_cell_ft">{info.gender=="male"?"男":"女"}</div>
            </div>
            <div className="weui_cell">
              <div className="weui_cell_bd weui_cell_primary"
                style={{minWidth: 120}}>
                <p>选手年龄</p>
              </div>
              <div className="weui_cell_ft">{info.age}</div>
            </div>

            {
              info.birthdate ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>出生年月</p>
                </div>
                <div className="weui_cell_ft">{info.birthdate}</div>
              </div> : ""
            }
            {
              info.city ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>城市</p>
                </div>
                <div className="weui_cell_ft">{info.city}</div>
              </div> : ""
            }
            {
              info.identity_card ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>身份证</p>
                </div>
                <div className="weui_cell_ft">{info.identity_card}</div>
              </div> : ""
            }
            {
              info.program ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>节目名称</p>
                </div>
                <div className="weui_cell_ft">{info.program}</div>
              </div> : ""
            }
            {
              info.company ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>选送单位</p>
                </div>
                <div className="weui_cell_ft">{info.company}</div>
              </div> : ""
            }
            {
              info.company_tel ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>单位电话</p>
                </div>
                <div className="weui_cell_ft">{info.company_tel}</div>
              </div> : ""
            }
            {
              info.teacher ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>指导老师</p>
                </div>
                <div className="weui_cell_ft">{info.teacher}</div>
              </div> : ""
            }
            {
              info.teacher_phone ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>老师电话</p>
                </div>
                <div className="weui_cell_ft">{info.teacher_phone}</div>
              </div> : ""
            }
            {
              info.match_class ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>参赛组别</p>
                </div>
                <div className="weui_cell_ft">{info.match_class}</div>
              </div> : ""
            }
            {
              info.major ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>参赛专业</p>
                </div>
                <div className="weui_cell_ft">{info.major}</div>
              </div> : ""
            }
            {
              info.awards ?
              <div className="weui_cell">
                <div className="weui_cell_bd weui_cell_primary"
                  style={{minWidth: 120}}>
                  <p>获奖经历</p>
                </div>
                <div className="weui_cell_ft">{info.awards}</div>
              </div> : ""
            }

          </div>

          <div className="weui_btn_area">
            <button type="button" style={{height: 100}}
                    onClick={this.verifyHandler}
                    className="weui_btn weui_btn_primary mb15 mt10">
              修改
            </button>
          </div>
          <div id="sign-page-wrap"></div>
        </div>
      )
    } else {
      return (
        <div className="sign-confirm sign-page" style={{overflowY: "auto"}}>
          <div className="back-btn" onClick={this.back}>报名信息</div>
            <div className="loading">
      				<img src="/static/img/loading.gif" alt=""/>
      			</div>
        </div>
      )
    }

  }

})
