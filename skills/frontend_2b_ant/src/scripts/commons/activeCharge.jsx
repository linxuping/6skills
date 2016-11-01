import React from 'react';
import { Form, Row, Col, Input, Icon } from 'antd';
const FormItem = Form.Item;
/**
 * 动态添加收费
 */
export default class ActiveCharges extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const nameProps = getFieldProps("charge_name", {rules:[
        {required: true, message: "请上传活动封面(海报)"}
      ]
    });
    return (
      <div className="py-panel">
				<div className="py-panel-hd">
					{
						this.props.title.length > 0 ?
						<Row>
							{
								this.props.title.map(function(item, idx) {
									return (
										<Col span={5} key={idx}
											className="tc">
											<span className="title">{item}</span>
										</Col>
									);
								}.bind(this))
							}
              <Col span={4}
                className="tc">
                <span className="title">删除</span>
              </Col>
						</Row>
						:
						<div className="title">{this.props.title}</div>
					}
				</div>
				<div className="py-panel-bd">
					{ this.props.charges ?
              this.props.charges.map((item, idx) => {
                return (
                  <Row>
                    <Col span={5}>
                      <FormItem>
                        <Input id={item} {...nameProps}></Input>
                      </FormItem>
                    </Col>
                    <Col span={5}>
                      <FormItem>
                        <Input id={item} {...nameProps}></Input>
                      </FormItem>
                    </Col>
                    <Col span={5}>
                      <FormItem>
                        <Input id={item} {...nameProps}></Input>
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <span>
                        <Icon type="plus"></Icon>
                      </span>

                    </Col>
                  </Row>
                )
              })
            :
              <Row>
                <Col span={5} className="pd10">
                  <FormItem>
                    <Input  {...nameProps}></Input>
                  </FormItem>
                </Col>
                <Col span={5} className="pd10">
                  <FormItem>
                    <Input  {...nameProps}></Input>
                  </FormItem>
                </Col>
                <Col span={5} className="pd10">
                  <FormItem>
                    <Input  {...nameProps}></Input>
                  </FormItem>
                </Col>
                <Col span={5} className="pd10">
                  <FormItem>
                    <Input  {...nameProps}></Input>
                  </FormItem>
                </Col>
                <Col span={3} className="pd10">
                  <Icon type="close"></Icon>
                </Col>
              </Row>
          }
				</div>
      </div>
    );
  }
}
