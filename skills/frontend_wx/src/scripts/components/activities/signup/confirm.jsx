import React, { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Back from '../../../common/back.jsx';
import Wui from 'react-weui';
const {Cells, Cell, CellsTitle, CellBody, CellFooter, ButtonArea, Button} = Wui;
import actions from '../../../actions/activities-actions';
import store from '../../../stores/activities-store';
import utils from '../../../common/utils';

export default class SignupComfirm extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    disabled: false
  }

  submitHandler() {
    this.setState({
      disabled: true
    });
    const data = sessionStorage.getItem(`_signup_msg_${this.props.params.actid}_`);
    let params = utils.url2json(data)
    console.log(params);
    params.actid = this.props.params.actid;
    actions.postSignup(this, params)
  }

  render() {

    const data =decodeURIComponent(sessionStorage.getItem(`_signup_msg_${this.props.params.actid}_`)).split("&")
    const fields = JSON.parse(sessionStorage.getItem("_signup_fields_"));
    return (
      <div className="sign-page">
        <Back>报名信息确认</Back>
        <CellsTitle>报名信息确认</CellsTitle>
        <Cells>
          {
            data.map(function(item, idx){
              let kv = item.split("=");
              let name = kv[0]
              if (name === "signid") {
                return ""
              }
              fields.forEach((field, idx)=>{
                if (name == field.name) {
                  name = field.label;
                }
              })
              if (kv[0] == "images") {
                kv[1] = <img src={kv[1]} style={{width: 120, height: 120}}/>
              } else if (kv[0] == "gender") {
                var genders = {"male": "男", "female": "女"};
                kv[1] = genders[kv[1]];
              }
              return (
                <Cell key={idx}>
                  <CellBody style={{minWidth: 120}}><p>{name}</p></CellBody>
                  <CellFooter>{kv[1]}</CellFooter>
                </Cell>
              )
            })
          }
        </Cells>
        <ButtonArea>
          <Button type="primary" disabled={this.state.disabled}
            onClick={this.submitHandler.bind(this)}>
            确认
          </Button>
        </ButtonArea>
      </div>
    );
  }
}

ReactMixin.onClass(SignupComfirm, Reflux.connect(store, "key"));
