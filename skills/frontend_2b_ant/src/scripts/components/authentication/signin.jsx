import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link} from 'react-router';
import {Row, Col, Form, Input, Checkbox, Button} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

class Signin extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  onSubmitHandler(e){
    e.preventDefault()
    console.log(this.props.form.getFieldsValue())
  }

  componentWillMount() {

  }

  render() {
    const { getFieldProps } = this.props.form;
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
                  {...getFieldProps('phone')}></Input>
              </FormItem>
              <FormItem className="mb0">
                <Input type="password" placeholder="密码" size="large"
                  {...getFieldProps('password')} />
              </FormItem>

              <FormItem className="mb0">
                <Link to="resetpw" className="fr">忘记密码？</Link>
              </FormItem>

              <Button htmlType="submit" type="primary" size="large"
                style={{"width": "100%"}}>
                  登录
              </Button>
              <Link to="/signup" className="mt10 fr">快速注册</Link>
            </Form>

          </div>

        </Col>
      </Row>

    );
  }
}

Signin = createForm()(Signin);

export default Signin;
