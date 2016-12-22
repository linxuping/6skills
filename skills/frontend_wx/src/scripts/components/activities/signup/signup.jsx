import React, { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Back from '../../../common/back.jsx';
import utils from '../../../common/utils';
import Weui from 'react-weui';
const {Toast, ButtonArea, Button, CellsTitle, CellsTips, Cell, CellHeader, CellBody, CellFooter, Form, FormCell, Icon, Input, Label, TextArea, Switch, Radio, Checkbox, Select, VCode, Agreement, Cells} = Weui;
import actions from '../../../actions/activities-actions';
import store from '../../../stores/activities-store';
const $ = require('jquery');
require('jquery-validation');

export default class Signup extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false,
    mountValidate: false
  }

  componentDidMount() {
    actions.fetchProfiles(this, {signid: this.props.location.query.signid})
  }

  componentDidUpdate(prevProps, prevState) {
    this.validateForm();
  }

  validateForm() {
    $("#signup-form").validate({
      rules: {
        "name": {required: true},
        "phone": {required: true, digits: true, rangelength:[11, 11]},
        "age": {required: true, min: 0, max: 99},
        "gender": {required: true},
        "city": {required: true},
        "kids_name": {required: true},
        //"identity_card": {required: true, rangelength: [18, 18]},
        "program": {required: true},
        "company": {required: true},
        "teacher": {required: true},
        "company_tel": {required: true},
        "teacher_phone": {required: true, digits: true, rangelength:[11, 11]},
        "birthdate": {required: true}
      },
      messages: {
        "name": {required: "必填"},
        "phone": {required: "请输入正确的手机号码", digits: "", rangelength: "11位手机号码" },
        "age": {required: "请输入年龄", min: "", max: ""},
        "gender": {required: "请选择选手性别"},
        "city": {required: "请输入所在城市"},
        "kids_name": {required: "请输入选手姓名"},
        //"identity_card": {required: "请输入身份证号", rangelength: "18位身份证"},
        "program": {required: "请输入节目名称"},
        "company": {required: "请输入选送单位"},
        "teacher": {required: "请输入指导老师"},
        "company_tel": {required: "请输入单位电话"},
        "teacher_phone": {required: "请输入老师电话", digits: "11位手机号码", rangelength:"11位手机号码"},
        birthdate: {required: "请输入选手出生日期(例:20100101)"}
      },
      submitHandler: (form)=>{
        const signMsg = $(form).serialize()
        sessionStorage.setItem(`_signup_msg_${this.props.params.actid}_` , signMsg)
        const fields = JSON.stringify(this.initFields(this.state.signtype));
        sessionStorage.setItem("_signup_fields_", fields);
        location.href = `#/activities/${this.props.params.actid}/signup-confirm`
      }
    })
  }

  initFields(signtype) {
    switch (signtype) {
      case "2" || 2:
        return [
          {name: "name", label: "真实姓名", type: "text", value: "username"},
          {name: "phone", label: "手机号码", type: "text"},
          {name: "city", label: "所在城市", type: "text"},
          {name: "kids_name", label: "儿童姓名", type: "text"},
          {name: "birthdate", label: "儿童出生年月", type: "text"},
          // {name: "age", label: "选手年龄", type: "select", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], extend: "岁"},
          {name: "gender", label: "选手性别", type: "radio", values: ["male@男", "female@女"]},
        ]
        break;
      case "3" || 3:
        return [
          {name: "name", label: "真实姓名", type: "text", value: "username"},
          {name: "phone", label: "手机号码", type: "text"},
          {name: "kids_name", label: "选手姓名", type: "text"},
          {name: "age", label: "选手年龄", type: "select", options: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], extend: "岁"},
          {name: "gender", label: "选手性别", type: "radio", values: ["male@男", "female@女"]},
          {name: "program", label: "节目名称", type: "text"},
          {name: "company", label: "选送单位", type: "text"},
          {name: "company", label: "选送单位", type: "text"},
          {name: "company_tel", label: "单位电话", type: "text"},
          {name: "teacher", label: "指导老师", type: "text"},
          {name: "teacher_phone", label: "老师电话", type: "text"},
          {name: "match_class", label: "参赛组别", type: "select", options: [
            "幼儿组（学龄前）",
            "小学甲组（1—2年级）",
            "小学乙组（3—4年级）",
            "小学丙组（5—6年级）",
            "初中组（1-3年级）",
            "高中组（1-3年级、中职）",
            "大学组（大学生、研究生、大专、留学生）",
          ]},
          {name: "major", label: "参赛专业", type: "select", options: [
            "书画-初赛"
          ]},
          {name: "awards", label: "获奖经历", type: "textarea"}
        ]
      default:
        return [
          {name: "name", label: "真实姓名", type: "text", value: "username"},
          {name: "phone", label: "手机号码", type: "text"},
          {name: "age", label: "选手年龄", type: "select", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], extend: "岁"},
          {name: "gender", label: "选手性别", type: "radio", values: ["male@男", "female@女"]},
        ]
    }
  }

  render() {
    let profile = this.state.profile || {};
    let signtype = this.state.signtype || 1;
    const fields = this.initFields(signtype)
    return (
      <div className="sign-page">
        <Back>报名</Back>
        {
          this.state.loaded ?
          <div className="signForm">
            <form action="#" id="signup-form" className="weui_cells_form">
              <input type="hidden" name="signid" value={this.props.location.query.signid}/>
              <CellsTitle>填写报名信息</CellsTitle>
              <Cells>
                {
                  fields.map((item, index)=>{
                    switch (item.type) {
                      case "text":
                        return (
                          <FormCell key={index}>
                            <CellHeader>
                              <Label htmlFor={item.name}>{item.label}</Label>
                            </CellHeader>
                            <CellBody>
                              <Input name={item.name} id={item.name} defaultValue={profile[item.value] || profile[item.name]}
                                placeholder={`请输入${item.label}`}></Input>
                            </CellBody>
                          </FormCell>
                        )
                      case "select":
                        return(
                          <FormCell select key={index} selectPos="after">
                            <CellHeader>
                              <Label htmlFor={item.name}>{item.label}</Label>
                            </CellHeader>
                            <CellBody>
                              <Select defaultValue={profile[item.name]} name={item.name}
                                id={item.name}>
                                {
                                  item.options.map((item2, index2)=>{
                                    return(
                                      <option value={item2} key={index2}>{item2 + (item.extend||"")}</option>
                                    )
                                  })
                                }
                              </Select>
                            </CellBody>
                          </FormCell>
                        )
                      case "radio":
                        return(
                          <div className="inner_cells" key={index}>
                            <CellsTitle>{item.label}</CellsTitle>
                            <Cells className="weui_cells_radio">
                              {
                                item.values.map((item2, index2)=>{
                                  const value = item2.split("@");
                                  return(
                                    <FormCell radio key={index2}>
                                      <CellBody>{value[1]}</CellBody>
                                      <CellFooter>
                                        {
                                          value[0] == profile[item.name] ||
                                            profile[item.name] == undefined && index2==0?
                                            <Radio name={item.name} value={value[0]}
                                              defaultChecked="checked"/>
                                            : <Radio name={item.name} value={value[0]}/>
                                        }
                                      </CellFooter>
                                    </FormCell>
                                  )
                                })
                              }
                            </Cells>
                          </div>
                        )
                      case "textarea":
                        return(
                          <div className="inner_cells" key={index}>
                            <CellsTitle>{item.label}</CellsTitle>
                            <Form>
                              <FormCell>
                                  <CellBody>
                                      <TextArea placeholder={"请输入" + item.label} name={item.name} id={item.name} rows="3"></TextArea>
                                  </CellBody>
                              </FormCell>
                            </Form>
                          </div>
                        )
                      default:
                        return ""
                    }
                  })
                }
              </Cells>
              <ButtonArea>
                <Button type="primary">
                  提交
                </Button>
              </ButtonArea>
            </form>
          </div>
          : <Toast icon="loading" show={true}>加载中...</Toast>
        }
      </div>
    );
  }
}

ReactMixin.onClass(Signup, Reflux.connect(store, "key"));
