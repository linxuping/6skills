import React, { Component, PropTypes } from 'react';
import TinyMCE from 'react-tinymce';
import { Form, Input, Select, Checkbox, Radio, Textarea, Upload, Icon, Row, Col, DatePicker, Cascader, Button} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const createForm = Form.create;

require('../../commons/upload/moxie.js');
require('../../commons/upload/plupload.js');
require('../../commons/upload/qiniu.js');
import uploadConfig from '../../commons/upload/upload-config.js';

let AddActivity = React.createClass({

  handleEditorChange(e){
    console.log(e.target.getContent())
  },

  handleSubmit(e){
    e.preventDefault();
    console.log(this.props.form.getFieldsValue());
    this.props.form.validateFields((errors, values) => {
      console.log(errors)
    });
  },

  handleReset(e){
    console.log(e)
  },

  componentDidMount() {
    var uploader = Qiniu.uploader(uploadConfig());
  },

  render() {
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const itemLayout = {labelCol: {span: 4}, wrapperCol: {span: 8}}
    const uploadProps = {
      action: '/upload',
      listType: 'picture-card'
    };
    const classOption = [
      {
        value: '1',
        label: "本地活动",
        children: [{
            label: "本地活动1",
            value: "11"
          },{
            label: "本地活动2",
            value: "12"
          }
        ]
      }, {
        value: '2',
        label: "兴趣启蒙",
        children: [{
          label: "兴趣启蒙1",
          value: "2.1"
        },{
          label: "兴趣启蒙2",
          value: "22"
        }]
      }
    ];
    const ageList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const titleProps = getFieldProps("title", {
      required: true, message: "活动标题不可为空"
    })
    return (
      <Form horizontal form={this.props.form}>
        <FormItem id="title" {...itemLayout} label="活动标题">
          <Input placeholder="请输入活动标题(200字以内)" {...titleProps} />
        </FormItem>

        <FormItem id="caverImage" label="活动封面" {...itemLayout}>
          <Upload {...uploadProps}>
            <Icon type="plus" style={{"fontSize": "2.4rem"}}></Icon>
            <div className="ant-upload-text">上传图片</div>
            <div className="upload-mask" id="pickfiles"></div>
          </Upload>
        </FormItem>

        <FormItem id="beginTime" {...itemLayout} label="活动时间">
          <RangePicker showTime format="yyyy-MM-dd HH:mm" />
        </FormItem>

        <FormItem id="area" label="活动分类" {...itemLayout}>
          <Cascader options={classOption} placeholder="请选择活动类型"></Cascader>
        </FormItem>

        <FormItem id="cost" label="活动费用" {...itemLayout}>
          <Row>
            <Col span={12}>
              <RadioGroup defaultValue="1">
                <Radio key="1" value="1">免费</Radio>
                <Radio key="2" value="2">收费</Radio>
              </RadioGroup>
            </Col>
            <Col span={12}>
              <Input placeholder="金额"></Input>
            </Col>
          </Row>
        </FormItem>

        <FormItem id="cost" label="活动人数限制" {...itemLayout}>
          <Row>
            <Col span={12}>
              <RadioGroup defaultValue="1">
                <Radio key="1" value="1">不限</Radio>
                <Radio key="2" value="2">其他</Radio>
              </RadioGroup>
            </Col>
            <Col span={12}>
              <Input placeholder="人数"></Input>
            </Col>
          </Row>
        </FormItem>

        <FormItem id="age" label="适合年龄段" {...itemLayout}>
          <Row>
            <Col span={11}>
              <Select defaultValue={1} allowClear>
                {
                  ageList.map(function(elem) {
                    return (
                      <Option key={elem} value={elem}>{elem}</Option>
                    );
                  })
                }
              </Select>
            </Col>
            <Col span={2}>
              <span className="pl10 pr10">至</span>
            </Col>
            <Col span={11}>
              <Select defaultValue={1} allowClear>
                {
                  ageList.map(function(elem) {
                    return (
                      <Option key={elem} value={elem}>{elem}</Option>
                    );
                  })
                }
              </Select>
            </Col>
          </Row>

        </FormItem>

        <FormItem id="caverImage" label="活动微信群二维码" {...itemLayout}>
          <Upload {...uploadProps}>
            <Icon type="plus" style={{"fontSize": "2.4rem"}}></Icon>
            <div className="ant-upload-text">上传图片</div>
          </Upload>
        </FormItem>

        <FormItem id="content" label="活动详情" labelCol={{span: 4}} wrapperCol={{span: 14}}>
          <TinyMCE
            content=""
            config={{
              plugins: 'link image code',
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | link image | code',
              height: 300
            }}
            onChange={this.handleEditorChange}
          />
        </FormItem>


        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </FormItem>

      </Form>
    );
  }
})

AddActivity = createForm()(AddActivity);
export default AddActivity;
