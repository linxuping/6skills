import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import auditAction from '../../actions/audit-action.jsx';
import auditStore from '../../stores/audit-store.jsx';
import { Row, Col, Button, Popconfirm, Popover, Input, Icon, notification } from 'antd';
const ButtonGroup = Button.Group;


export default class AuditDetail extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    rejectPanelVisible: false
  }

  componentDidMount() {
    auditAction.fatchAuditDetail(this, this.props.params.id);
  }

  rejectHandler(){
    if (this.refs.rejectref.value == "") {
      notification["error"]({
        message: '提示',
        description: '请填写拒绝理由！',
      })
    } else {
      auditAction.authHandler(this,
        {
          id: this.props.params.id,
          type: "deny",
          desc: this.refs.rejectref.value
        });
    }
    this.hide();
  }

  hide(){
    this.setState({
      rejectPanelVisible: false
    });
  }

  handleVisibleChange(visible) {
    this.setState({ rejectPanelVisible: visible });
  }

  passHandler(){
    auditAction.authHandler(this, {id: this.props.params.id, type: "pass"});
  }

  render() {
    const rejectContent =
      <div>
        <div className="ant-popover-message">
          <Icon type="exclamation-circle"/>
          <div className="ant-popover-message-title mb5">确定拒绝该商户申请？</div>
          <span className="ant-input-wrapper">
            <input type="text" placeholder="拒绝理由" className="ant-input" ref="rejectref"/>
          </span>
        </div>
        <div className="ant-popover-buttons">
          <Button size="small" type="default" onClick={this.hide.bind(this)}>否</Button>
          <Button size="small" type="primary" onClick={this.rejectHandler.bind(this)}>是</Button>
        </div>
      </div>

    return (
      <div className="audit-detail">

        <Row className="mt30">
          <Col span={4}>
            <h3 className="hd tr">是否有营业执照</h3>
          </Col>
          <Col span={19} className="pl20">
            <div className="bd">
              <p className="bs-msg">是</p>
            </div>
          </Col>
        </Row>

        <Row className="mt30">
          <Col span={4}>
            <h3 className="hd tr">营业执照</h3>
          </Col>
          <Col span={19} className="pl20">
            <div className="bd">
              <p className="bs-msg">
                <img src={require('images/sign_bg_2.jpg')} alt=""/>
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mt30">
          <Col span={4}>
            <h3 className="hd tr">商户名称</h3>
          </Col>
          <Col span={19} className="pl20">
            <div className="bd">
              <p className="bs-msg">美吉姆番禺分校</p>
            </div>
          </Col>
        </Row>

        <Row className="mt30">
          <Col span={4}>
            <h3 className="hd tr">联系人姓名</h3>
          </Col>
          <Col span={19} className="pl20">
            <div className="bd">
              <p className="bs-msg">张三</p>
            </div>
          </Col>
        </Row>

        <Row className="mt30">
          <Col span={4}>
            <h3 className="hd tr">联系人电话</h3>
          </Col>
          <Col span={19} className="pl20">
            <div className="bd">
              <tel className="bs-msg">13912345678</tel>
            </div>
          </Col>
        </Row>

        <Row style={{marginTop: 50}}>
          <Col span={10} offset={5}>
            <Popover
              content={rejectContent}
              trigger="click"
              visible={this.state.rejectPanelVisible}
              onVisibleChange={this.handleVisibleChange.bind(this)}
            >
              <Button type="default" size="large" className="mr30">
                拒绝
              </Button>
            </Popover>

            <Popconfirm title="确定通过该商户申请？" okText="是" cancelText="否"
              onConfirm={this.passHandler.bind(this)}>
              <Button type="primary" size="large">
                通过
              </Button>
            </Popconfirm>
          </Col>
        </Row>

      </div>
    );
  }
}

ReactMixin.onClass(AuditDetail, Reflux.connect(auditStore, "key"));
