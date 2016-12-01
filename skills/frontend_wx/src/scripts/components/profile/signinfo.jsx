import React, { Component, PropTypes } from 'react';
import Back from '../../common/back.jsx';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Weui from 'react-weui';
const {CellsTitle, Cells, Cell, CellBody, CellFooter, Button, Toast} = Weui;
import actions from '../../actions/activities-actions';
import store from '../../stores/activities-store';

export default class Signinfo extends Component {

  static propTypes = {}

  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    actions.fetchSigninfo(this, {signid: this.props.params.signid})
  }

  render() {
    let info = this.state.signinfo || {};
    return (
      <div className="signinfo mt120">
        <Back>报名信息</Back>
        {
          this.state.loaded ?
            <div>
              <CellsTitle>报名信息</CellsTitle>
              <Cells>
                <Cell>
                  <CellBody><p>家长姓名</p></CellBody>
                  <CellFooter>{info.username_pa}</CellFooter>
                </Cell>

                {
                  info.kids_name ?
                    <Cell>
                      <CellBody><p>选手姓名</p></CellBody>
                      <CellFooter>{info.kids_name}</CellFooter>
                    </Cell> : ""
                }

                <Cell>
                  <CellBody><p>手机号码</p></CellBody>
                  <CellFooter>{info.phone}</CellFooter>
                </Cell>
                <Cell>
                  <CellBody><p>选手性别</p></CellBody>
                  <CellFooter>{info.gender=="male"?"男":"女"}</CellFooter>
                </Cell>
                <Cell>
                  <CellBody><p>选手年龄</p></CellBody>
                  <CellFooter>{info.age}</CellFooter>
                </Cell>

                {
                  info.birthdate ?
                    <Cell>
                      <CellBody><p>出生年月</p></CellBody>
                      <CellFooter>{info.birthdate}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.city ?
                    <Cell>
                      <CellBody><p>城市</p></CellBody>
                      <CellFooter>{info.city}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.identity_card ?
                    <Cell>
                      <CellBody><p>身份证</p></CellBody>
                      <CellFooter>{info.identity_card}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.program ?
                    <Cell>
                      <CellBody><p>节目名称</p></CellBody>
                      <CellFooter>{info.program}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.company ?
                    <Cell>
                      <CellBody><p>选送单位</p></CellBody>
                      <CellFooter>{info.company}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.company_tel ?
                    <Cell>
                      <CellBody><p>单位电话</p></CellBody>
                      <CellFooter>{info.company_tel}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.teacher ?
                    <Cell>
                      <CellBody><p>指导老师</p></CellBody>
                      <CellFooter>{info.teacher}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.teacher_phone ?
                    <Cell>
                      <CellBody><p>老师电话</p></CellBody>
                      <CellFooter>{info.teacher_phone}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.match_class ?
                    <Cell>
                      <CellBody><p>参赛组别</p></CellBody>
                      <CellFooter>{info.match_class}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.major ?
                    <Cell>
                      <CellBody><p>参赛专业</p></CellBody>
                      <CellFooter>{info.major}</CellFooter>
                    </Cell> : ""
                }
                {
                  info.awards ?
                    <Cell>
                      <CellBody><p>获奖经历</p></CellBody>
                      <CellFooter>{info.awards}</CellFooter>
                    </Cell> : ""
                }

              </Cells>
              <div className="weui_btn_area">
                <Button type="primary" href={`#/activities/${info.actid}/signup`}>
                  修改
                </Button>
              </div>
            </div>
            : <Toast icon="loading" show={true}>加载中...</Toast>
        }

      </div>
    );
  }
}

ReactMixin.onClass(Signinfo, Reflux.connect(store, "key"));
