import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import activityAction from '../../actions/activity-action.jsx';
import activityStore from '../../stores/activity-store.jsx';
import Upload from '../../commons/upload/upload-component.jsx';

import TinyMCE from 'react-tinymce';
import { Form, Input, Select, Checkbox, Radio, Textarea, Icon, Row, Col, DatePicker, Cascader, Button} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const createForm = Form.create;

let AddActivity = React.createClass({

  getInitialState: function() {
    return {
      costBool: "0",
      personnumBool: "0"
    };
  },

  handleEditorChange(e){
    console.log(e.target.getContent())
    this.props.form.setFieldsValue({"content": e.target.getContent()});
    //ReactDom.findDOMNode(this.refs.content).value =  e.target.getContent();
  },

  handleSubmit(e){
    e.preventDefault();
    //console.log(this.props.form.getFieldsValue());
    this.props.form.validateFields((errors, values) => {
      console.log(errors)
      //submit the form
      if (errors == null) {
        //reduced params
        values.firstacttype = values.classes[0];
        values.secondacttype = values.classes[1];
        values.begintime = values.times[0];
        values.endtime = values.times[1];
        activityAction.addActivityHandler(this, values, e.target);
      }
    });
  },

  handleReset(e){
    console.log(e)
  },

  componentDidMount() {

    // let Qiniu2 = new QiniuJsSDK();
    // let uploader2 = Qiniu2.uploader(uploadConfig({
    //   id: "pickfiles2",
    //   "key":"qrcode",
    //   successCallBack: this.qrcodeCallBackHandler
    // }));
  },

  coverSuccess(fileObj, domain){
    //let fileObj = JSON.parse(file);
    this.props.form.setFieldsValue({"coverimage": domain + fileObj.key})
    //ReactDom.findDOMNode(this.refs.coverimage).value = domain + fileObj.key;
  },

  qrcodeSuccess(fileObj, domain){
    //let fileObj = JSON.parse(file);
    this.props.form.setFieldsValue({"qrcode": domain + fileObj.key})
  },

  personnumBoolChangeHandler(e){
    //console.log(this.props.form.getFieldProps("personnumBool").value)
    let personnumBool = this.props.form.getFieldProps("personnumBool").value
    this.setState({
      personnumBool: personnumBool == "0" ? "1" : "0"
    });
  },

  costBoolChangeHandler(e){
    //console.log(this.props.form.getFieldProps("personnumBool").value)
    let costBool = this.props.form.getFieldProps("costBool").value
    this.setState({
      costBool: costBool == "0" ? "1" : "0"
    });
  },

  render() {
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const itemLayout = {labelCol: {span: 4}, wrapperCol: {span: 8}}
    const classOption = [
      {
        value: '1',
        label: "本地活动",
        children: [{
            label: "本地活动1",
            value: "11"
          }, {
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
    const titleProps = getFieldProps("title", {rules:[
        {required: true, message: "请输入活动标题"}
      ]
    });
    const coverProps = getFieldProps("coverimage", {rules:[
        {required: true, message: "请上传活动封面(海报)"}
      ]
    });
    const qrcodeProps = getFieldProps("qrcode", {rules:[
        {required: true, message: "请上传活动群二维码"}
      ]
    });
    const timeProps = getFieldProps("times", {
      rules: [
        {required: true, message: "请选择活动时间",type: "array"}
      ]
    });
    const cityProps = getFieldProps("city", {
      rules: [
        {required: true, message: "请输入城市"}
      ]
    });
    const areaProps = getFieldProps("area", {
      rules: [
        {required: true, message: "请输入区域"}
      ]
    });
    const addressProps = getFieldProps("address", {
      rules: [
        {required: true, message: "请输入详细活动集合地点"}
      ]
    });
    const classesProps = getFieldProps("classes", {
      rules: [
        {required: true, message: "请选择活动分类", type: "array"}
      ]
    });
    const agefromProps = getFieldProps("agefrom", {
      rules: [
        {type: 'integer', required: true, message: "请选择合适的年龄段"}
      ],
      initialValue: 1
    });
    const agetoProps = getFieldProps("ageto", {
      rules: [
        {type: 'integer', required: true, message: "请选择合适的年龄段"}
      ],
      initialValue: 1
    });
    const costProps = getFieldProps("cost", {
      initialValue: "0"
    });
    const personnumProps = getFieldProps("personnum", {
      initialValue: "0"
    });

    const contentProps = getFieldProps("content", {
      rules: [
        {required: true, message: "请输入活动详情"}
      ]
    });
    return (
      <Form horizontal form={this.props.form} onSubmit={this.handleSubmit}>
        <FormItem id="title" {...itemLayout} label="活动标题">
          <Input placeholder="请输入活动标题(200字以内)" {...titleProps} />
        </FormItem>

        <FormItem id="coverImage" label="活动封面" {...itemLayout} required={true}>
          <Upload uploadKey="coverimage"
                  id="coverimage-pickfiles"
                  imgProps={coverProps}
                  success={this.coverSuccess}/>

        </FormItem>

        <FormItem id="times" {...itemLayout} label="活动时间">
          <RangePicker showTime format="yyyy-MM-dd HH:mm" {...timeProps}/>
        </FormItem>

        <FormItem {...itemLayout} label="活动集合地点" required={true}>
          <Row>
            <Col span={4} className="tc">
              城市
            </Col>
            <Col span={4}>
              <Input id="city" placeholder="城市" {...cityProps}></Input>
            </Col>
            <Col span={4} className="tc">区域</Col>
            <Col span={4}>
              <Input id="area" placeholder="区域" {...areaProps}></Input>
            </Col>
            <Col span={7} offset={1}>
              <Input id="address" placeholder="详细地址" {...addressProps}></Input>
            </Col>
          </Row>
        </FormItem>

        <FormItem id="classes" label="活动分类" {...itemLayout}>
          <Cascader options={classOption} placeholder="请选择活动类型"
            {...classesProps}></Cascader>
        </FormItem>

        <FormItem id="cost" label="活动费用" {...itemLayout}
          required={true}>
          <Row>
            <Col span={12}>
              <RadioGroup {...getFieldProps("costBool", {onChange: this.costBoolChangeHandler, initialValue: this.state.costBool})}>
                <Radio key="1" value="0">免费</Radio>
                <Radio key="2" value="1">收费</Radio>
              </RadioGroup>
            </Col>
            {
              this.state.costBool == "0" ? "" :
              <Col span={12}>
                <Input placeholder="金额" {...costProps}></Input>
              </Col>
            }
          </Row>
        </FormItem>

        <FormItem id="cost" label="活动人数限制" {...itemLayout}
          required={true}>
          <Row>
            <Col span={12}>
              <RadioGroup {...getFieldProps("personnumBool", {onChange: this.personnumBoolChangeHandler, initialValue: this.state.personnumBool})}>
                <Radio key="1" value="0">不限</Radio>
                <Radio key="2" value="1">其他</Radio>
              </RadioGroup>
            </Col>
            {
              //不知道什么getFieldValues那里获取的是前一个数据
              this.state.personnumBool == "0" ? "" :
              <Col span={12}>
                <Input placeholder="人数" name="personnum" {...personnumProps}></Input>
              </Col>
            }
          </Row>
        </FormItem>

        <FormItem id="age" label="适合年龄段" {...itemLayout}
          required={true}>
          <Row>
            <Col span={11}>
              <Select allowClear {...agefromProps}>
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
              <Select allowClear {...agetoProps}>
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

        <FormItem label="活动微信群二维码" {...itemLayout}>
          <Upload uploadKey="qrcode"
                  id="qrcode-pickfiles"
                  imgProps={qrcodeProps}
                  success={this.qrcodeSuccess}/>
        </FormItem>

        <FormItem id="content" label="活动详情" required={true}
          labelCol={{span: 4}} wrapperCol={{span: 14}}>
          <div>
            <input type="hidden" name="content" ref="content" {...contentProps}/>
            <TinyMCE
              content=""
              config={{
                menubar: false,
                plugins: 'link image',
                toolbar: 'fontsizeselect bold italic underline | alignleft aligncenter alignright alignjustify removeformat | link image | undo redo ',
                height: 300
              }}
              onChange={this.handleEditorChange}/>
          </div>
        </FormItem>


        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type="primary" htmlType="submit">确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </FormItem>

      </Form>
    );
  }
})

AddActivity = createForm()(AddActivity);
export default AddActivity;

ReactMixin.onClass(AddActivity, Reflux.connect(activityStore, "key"));
