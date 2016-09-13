import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link} from 'react-router';
import {Row, Col, Form, Input, Checkbox, Button} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

class Signup extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  onSubmitHandler(e){
    e.preventDefault()
    console.log(this.props.form.getFieldsValue())
    this.props.form.validateFields((errors, values) => {
      console.log(errors);
    })
  }

  getCodeHandler(ev){

  }

  checkPassComfirm(rule, value, callback) {
    const {getFieldValue} = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次密码不相同');
    } else {
      callback();
    }
  }

  render() {
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const phonePorps = getFieldProps("phone", {
      rules: [
        {required: true,  message: "请输入手机", pattern: /^[1][0-9]{10}$/}
      ]
    });
    const codeProps = getFieldProps("code", {
      rules: [
        {required: true, message: "请输入验证码"}
      ]
    });
    const passwordProps = getFieldProps("password", {
      rules: [
        {required: true, message: "请输入密码"}
      ]
    });
    const passwordConfirmProps = getFieldProps("passwordConform", {
      rules: [
        {required: true, message: "请输入确认密码"},
        {validator: this.checkPassComfirm.bind(this)}
      ]
    })
    return (
      <Row>
        <Col span={8} offset={8}>
          <div className="form-wrap clearfix">
            <header className="form-title">
              <div className="brand">
                LOGO
              </div>
              欢迎来到四书科技
            </header>
            <Form horizontal onSubmit={this.onSubmitHandler.bind(this)}>
              <FormItem>
                <Input placeholder="账户(手机)" size="large"
                  {...phonePorps}></Input>
              </FormItem>

              <Row>
                <Col span={16}>
                <FormItem>
                  <Input placeholder="验证码" size="large"
                  {...codeProps} style={{"with": "66.6666%"}}></Input>
                </FormItem>
                </Col>
                <Col span={8}>
                  <Button htmlType="button" type="primary" size="large" className="fr" onClick={this.getCodeHandler.bind(this)}>
                    获取验证码
                  </Button>
                </Col>
              </Row>

              <FormItem className="">
                <Input type="password" placeholder="密码" size="large"
                  {...passwordProps} />
              </FormItem>

              <FormItem className="">
                <Input type="password" placeholder="确认密码" size="large"
                  {...passwordConfirmProps} />
              </FormItem>

              <Button htmlType="submit" type="primary" size="large"
                style={{"width": "100%"}}>
                  注册
              </Button>
              <Link to="/signin" className="mt10 fr">已有账户？请登录</Link>
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

Signup = createForm()(Signup);

export default Signup;
