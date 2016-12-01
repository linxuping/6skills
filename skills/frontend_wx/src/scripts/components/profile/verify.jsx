import React, {PropTypes} from 'react';
import Back from '../../common/back.jsx';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Weui from 'react-weui';
const {Cells, Cell, CellBody, CellHeader, CellFooter, CellsTitle, Label, Input, Button} = Weui;
import actions from '../../actions/profile-actions';
import store from '../../stores/profile-store';
const $ = require("jquery")
require('jquery-validation')

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    codeText: "获取验证码",
    submitDisabled:false
  }

  getCode(ev){
    ev.preventDefault()
    let phone = parseInt(this.refs.phone.value)
    if(!this.validator.element($("#phone"))){
      $("#phone").focus();
      return false;
    } else {
      actions.getCode(this, {phone: phone})
    }
  }

  componentDidMount() {
    this.validation()
  }

  submitHandler() {
    $("#auth-form").submit();
  }

  validation() {
    this.validator = $("#auth-form").validate({
      rules: {
        "phone": {required: true, digits: true, rangelength:[11, 11]},
        "code": {required: true}
      },
      messages: {
        phone: {required: "请输入手机号码", digits: "", rangelength: "11位手机号码" },
        code: {required: "请输入验证码"}
      },
      submitHandler: (form)=>{
        this.setState({submitDisabled: true });
        actions.verifyPhone(this, form);
      }
    })
  }

  componentWillMount() {
    let profile = sessionStorage.getItem("_profile__profile_");
    if (profile) {
      profile = JSON.parse(profile);
      this.setState({
        porfile: profile
      });
    }
  }

  render() {
    let profile = sessionStorage.getItem("_profile__profile_") || "{}";
    profile = JSON.parse(profile);
    return (
      <div className="verify">
        <Back>手机认证</Back>

        <CellsTitle>验证手机号</CellsTitle>
        <form action="/wxauth" method="post" id="auth-form" className="weui_cells weui_cells_form">
          <Cell>
            <CellHeader><Label htmlFor="phone">手机号</Label></CellHeader>
            <CellBody>
              <input type="number" name="phone" id="phone" pattern="[0-9*]" defaultValue={profile.phone}
                placeholder="11位手机号" ref="phone" className="weui_input"></input>
            </CellBody>
          </Cell>
          <Cell style={{paddingTop: 17, paddingBottom: 17}}>
            <CellHeader>
              <Label htmlFor="code">验证码</Label>
            </CellHeader>
            <CellBody>
              <Input type="text" name="code" id="code" placeholder="验证码"></Input>
            </CellBody>
            <CellFooter>
              <Button type="default" size="small" plain disabled={this.state.codeDisable}
                 style={{width: 120}} onClick={this.getCode.bind(this)}>
                {this.state.codeText}
              </Button>
            </CellFooter>
          </Cell>
        </form>
        <div className="weui_btn_area">
          <Button type="primary" onClick={this.submitHandler.bind(this)}
            disabled={this.state.submitDisabled}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

ReactMixin.onClass(Verify, Reflux.connect(store, "key"));
