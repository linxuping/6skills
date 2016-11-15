import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import ActiveCharge from '../../commons/activeCharge.jsx';
import activityAction from '../../actions/activity-action.jsx';
import activityStore from '../../stores/activity-store.jsx';
import Upload from '../../commons/upload/upload-component.jsx';
require('css/simditor.css');
var Simeditor = require("simditor");

import { Form, Input, Select, Checkbox, Radio, Textarea, Icon, Row, Col, DatePicker, Cascader, Button, Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const createForm = Form.create;

import uploadConfig from '../../commons/upload/upload-config.js';
var editor;

let AddActivity = React.createClass({

  getInitialState: function() {
    return {
      costBool: "0",
      personnumBool: "0",
      modal2Visible: false,
      contentId: "content"
    };
  },

  handleEditorChange(e){
    console.log(e.target.getContent())
    this.props.form.setFieldsValue({"content": e.target.getContent()});
    //ReactDom.findDOMNode(this.refs.content).value =  e.target.getContent();
  },

  setModal2Visible(modal2Visible){
    this.setState({
      modal2Visible: modal2Visible
    });
  },

  contentUploadSuccessCallBack(file, domain){
    let fileObj = JSON.parse(file);
    this.props.form.setFieldsValue({"contentImgUrl": domain + fileObj.key});
  },

  uploadCompleteHandler(){
    let imgObj =
      this.props.form.getFieldsValue(["contentImgUrl", "contentImgWidth", "contentImgHeight"]);
    let img = $("<img />").attr("src", imgObj.contentImgUrl).css({width: imgObj.contentImgWidth + "px", height: imgObj.contentImgHeight + "px"});
    $(editor.body[0]).append(img);
    this.setModal2Visible(false);
  },

  handleSubmit(e){
    e.preventDefault();
    //console.log(this.props.form.getFieldsValue());
    this.props.form.validateFields((errors, values) => {
      console.log(values);
      console.log(errors)
      //submit the form
      if (errors == null) {
        //reduced params
        // values.firstacttype = values.classes[0];
        // values.secondacttype = values.classes[1];
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
    //get cities
    activityAction.fatchCityHandler(this);
    //get first act_type
    activityAction.fatchActTypesHandler(this, {level: 1});

    //editor
    editor = new Simeditor({
      textarea: $("#editor"),
      toolbar: [
        'title', 'bold', 'italic', 'underline', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment'],
      placeholder: "上传图片后请编辑一下，否则上传的图片将无效..."
    })
    editor.on('valuechanged', (e, src) => {
      let content = e.target.body[0].innerHTML;
      this.props.form.setFieldsValue({"content": content});
    });

    //content upload
    const uploadBtn = '<p><button type="button" title="上传" id="uploadBtn" class="ant-btn ant-btn-primary mr10 mt5"><i class="anticon anticon-area-chart"/></button></p>';
    $(".content-item>.ant-form-item-label").append(uploadBtn);
    $(document).on('click', '#uploadBtn', ()=>{
      this.setModal2Visible(true);

      let qiniu = new QiniuJsSDK()
      qiniu.uploader(uploadConfig({
        key: "content",
        id: "content-img-upload",
        successCallBack: this.contentUploadSuccessCallBack
      }));

    });
  },

  cityChangeHandler(value){
    this.props.form.setFieldsValue({"area": undefined});
    activityAction.fatchAreaHandler(this, {city: value});
  },

  firstacttypeChangeHandler(value){
    //get second type
    this.props.form.setFieldsValue({"secondacttype": undefined})
    activityAction.fatchActTypesHandler(this, {level: 2, type: value})
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
    //console.log(this.props.form.getFieldDecorator("personnumBool").value)
    let personnumBool = this.props.form.getFieldDecorator("personnumBool").value
    this.setState({
      personnumBool: personnumBool == "0" ? "1" : "0"
    });
  },

  costBoolChangeHandler(e){
    let costBool = this.props.form.getFieldDecorator("costBool").value
    this.setState({
      costBool: costBool == "0" ? "1" : "0"
    });
  },

  render() {
    const {getFieldDecorator, getFieldError, isFieldValidating} = this.props.form;
    const itemLayout = {labelCol: {span: 4}, wrapperCol: {span: 16}}
    const ageList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const titleProps = getFieldDecorator("title", {rules:[
        {required: true, message: "请输入课程标题"}
      ]
    });
    const coverProps = getFieldDecorator("coverimage", {rules:[
        {required: true, message: "请上传封面图(海报)"}
      ]
    });
    const qrcodeProps = getFieldDecorator("qrcode");
    const timeProps = getFieldDecorator("times", {
      rules: [
        {required: true, message: "请选择时间",type: "array"}
      ]
    });
    const cityProps = getFieldDecorator("city", {
      rules: [
        {required: true, message: "请选择城市"}
      ],
      onChange: this.cityChangeHandler
    });
    const areaProps = getFieldDecorator("area", {
      rules: [
        {required: true, message: "请选择区域"}
      ]
    });
    const addressProps = getFieldDecorator("address", {
      rules: [
        {required: true, message: "请输入详细上课地址"}
      ]
    });
    const firstActTypeProps = getFieldDecorator("firstacttype", {
      rules: [
        {required: true, message: "请选择课程分类"}
      ],
      onChange: this.firstacttypeChangeHandler
    });
    const secondActTypeProps = getFieldDecorator("secondacttype", {
      rules: [
        {required: true, message: "请选择课程具体类型"}
      ]
    });
    const agefromProps = getFieldDecorator("agefrom", {
      rules: [
        {type: 'integer', required: true, message: "请选择合适的年龄段"}
      ],
      initialValue: 1
    });
    const agetoProps = getFieldDecorator("ageto", {
      rules: [
        {type: 'integer', required: true, message: "请选择合适的年龄段"}
      ],
      initialValue: 2
    });
    const costProps = getFieldDecorator("cost", {
      initialValue: "0"
    });
    const personnumProps = getFieldDecorator("personnum", {
      initialValue: "0"
    });

    const contentProps = getFieldDecorator("content", {
      rules: [
        {required: true, message: "请输入课程详情"}
      ]
    });
    return (
      <Form horizontal form={this.props.form} onSubmit={this.handleSubmit}>
        <FormItem id="title" {...itemLayout} label="课程标题">
          <Input placeholder="请输入课程标题(200字以内)" {...titleProps} />
        </FormItem>

        <FormItem id="coverImage" label="封面图" {...itemLayout} required={true}>
          <Upload uploadKey="coverimage"
                  id="coverimage-pickfiles"
                  imgProps={coverProps}
                  success={this.coverSuccess}/>

        </FormItem>

        <FormItem id="times" {...itemLayout} label="时间">
          <RangePicker showTime format="yyyy-MM-dd HH:mm" {...timeProps}/>
        </FormItem>

        <Row>
          <Col span={4}>
            <FormItem label="上课地点" required={true}  {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
          </Col>
          <Col span={16}>
            <Row>
              <Col span={4}>
                <FormItem>
                  <Select allowClear {...cityProps} placeholder="城市">
                    {
                      this.state.cities
                        && this.state.cities.map(function(elem) {
                        return (
                          <Option key={elem} value="{elem}">{elem}</Option>
                        );
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={4} offset={1}>
                <FormItem>
                  <Select allowClear {...areaProps} placeholder="区域">
                    {
                      this.state.areas
                        && this.state.areas.map(function(elem) {
                        return (
                          <Option key={elem} value="{elem}">{elem}</Option>
                        );
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={14} offset={1}>
                <FormItem>
                  <Input id="address" placeholder="详细地址" {...addressProps}></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={4}>
            <FormItem label="课程分类" required={true}  {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={11}>
                <FormItem>
                  <Select allowClear {...firstActTypeProps} placeholder="课程类型">
                    {
                      this.state.firstacttype &&
                        this.state.firstacttype.map(function(elem, idx) {
                          return (
                            <Option key={elem} value="{elem}">{elem}</Option>
                          );
                        })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={11} offset={2}>
                <FormItem>
                  <Select allowClear {...secondActTypeProps} placeholder="具体分类">
                    {
                      this.state.secondacttype &&
                        this.state.secondacttype.map(function(elem) {
                          return (
                            <Option key={elem} value="{elem}">{elem}</Option>
                          );
                        })
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>

          </Col>
        </Row>

        <FormItem id="cost" label="课程费用" {...itemLayout}
          required={true}>
          <Row>
            <Col span={6}>
              <RadioGroup {...getFieldDecorator("costBool", {onChange: this.costBoolChangeHandler, initialValue: this.state.costBool})}>
                <Radio key="1" value="0">免费</Radio>
                <Radio key="2" value="1">收费</Radio>
              </RadioGroup>
            </Col>

          </Row>
          {
              this.state.costBool == "0" ? "" :
              <Row>
                <Col span={24}>
                  <ActiveCharge title={["编号", "电子票类型", "金额", "人数"]}
                      charges={this.state.charges}
                      form={this.props.form}>
                  </ActiveCharge>
                  {/*<Input placeholder="金额" {...costProps}></Input>*/}
                </Col>
              </Row>
            }
        </FormItem>

        <FormItem id="cost" label="课程人数限制" {...itemLayout}
          required={true}>
          <Row>
            <Col span={6}>
              <RadioGroup {...getFieldDecorator("personnumBool", {onChange: this.personnumBoolChangeHandler, initialValue: this.state.personnumBool})}>
                <Radio key="1" value="0">不限</Radio>
                <Radio key="2" value="1">其他</Radio>
              </RadioGroup>
            </Col>
            {
              //不知道什么getFieldValues那里获取的是前一个数据
              this.state.personnumBool == "0" ? "" :
              <Col span={18}>
                <Input placeholder="人数" name="personnum" {...personnumProps}></Input>
              </Col>
            }
          </Row>
        </FormItem>

        <Row>
          <Col span={4}>
            <FormItem label="适合年龄段" required={true}  {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={11}>
                <FormItem>
                  <Select allowClear {...agefromProps}>
                    {
                      ageList.map(function(elem) {
                        return (
                          <Option key={elem} value="{elem}">{elem}</Option>
                        );
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={2}>
                <span className="pl10 pr10" style={{lineHeight: "35px"}}>至</span>
              </Col>
              <Col span={11}>
                <FormItem>
                  <Select allowClear {...agetoProps}>
                    {
                      ageList.map(function(elem) {
                        return (
                          <Option key={elem} value="{elem}">{elem}</Option>
                        );
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>

        <FormItem label="活动微信群二维码" {...itemLayout}>
          <Upload uploadKey="qrcode"
                  id="qrcode-pickfiles"
                  imgProps={qrcodeProps}
                  success={this.qrcodeSuccess}/>
        </FormItem>

        <FormItem  label="课程详情" required={true} className="content-item"
          labelCol={{span: 4}} wrapperCol={{span: 16}}>
          <div>
            <input type="hidden" {...contentProps}/>
            <textarea id="editor"></textarea>
            <Modal
              title="图片上传"
              wrapClassName="vertical-center-modal"
              visible={this.state.modal2Visible}
              onOk={this.uploadCompleteHandler}
              onCancel={() => this.setModal2Visible(false)}
            >
              <Row>
                <Col span={4}>
                  <FormItem label="URL" {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
                </Col>
                <Col span={15}>
                  <FormItem>
                    <Input name="imgUrl" placeholder="url" {...getFieldDecorator("contentImgUrl")}></Input>
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem>
                    <Button htmlType="button" type="primary" size="large" className="fr" id="content-img-upload">
                    <Icon type="upload" />
                    上传
                  </Button>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <FormItem label="大小" {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Input name="width" placeholder="宽" {...getFieldDecorator("contentImgWidth")}></Input>
                  </FormItem>
                </Col>
                <Col span={3} className="tc">
                  <span style={{"fontSize": 20}}>×</span>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Input name="height" placeholder="高" {...getFieldDecorator("contentImgHeight")}></Input>
                  </FormItem>
                </Col>
              </Row>
            </Modal>
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

AddActivity = Form.create()(AddActivity);
export default AddActivity;

ReactMixin.onClass(AddActivity, Reflux.connect(activityStore, "key"));
