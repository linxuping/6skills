import React from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import activityAction from '../../actions/activity-action.jsx';
import activityStore from '../../stores/activity-store.jsx';
import Upload from '../../commons/upload/upload-component.jsx';
require('simditor/styles/simditor.css');
var Simeditor = require("simditor");

//import TinyMCE from 'react-tinymce';
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
    const qrcodeProps = getFieldProps("qrcode");
    const timeProps = getFieldProps("times", {
      rules: [
        {required: true, message: "请选择活动时间",type: "array"}
      ]
    });
    const cityProps = getFieldProps("city", {
      rules: [
        {required: true, message: "请选择城市"}
      ],
      onChange: this.cityChangeHandler
    });
    const areaProps = getFieldProps("area", {
      rules: [
        {required: true, message: "请选择区域"}
      ]
    });
    const addressProps = getFieldProps("address", {
      rules: [
        {required: true, message: "请输入详细活动集合地点"}
      ]
    });
    const firstActTypeProps = getFieldProps("firstacttype", {
      rules: [
        {required: true, message: "请选择活动分类大类"}
      ],
      onChange: this.firstacttypeChangeHandler
    });
    const secondActTypeProps = getFieldProps("secondacttype", {
      rules: [
        {required: true, message: "请选择活动分类小类"}
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
      initialValue: 2
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

        <Row>
          <Col span={4}>
            <FormItem label="活动集合地点" required={true}  {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={5}>
                <FormItem>
                  <Select allowClear {...cityProps} placeholder="城市">
                    {
                      this.state.cities
                        && this.state.cities.map(function(elem) {
                        return (
                          <Option key={elem} value={elem}>{elem}</Option>
                        );
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={6} offset={1}>
                <FormItem>
                  <Select allowClear {...areaProps} placeholder="区域">
                    {
                      this.state.areas
                        && this.state.areas.map(function(elem) {
                        return (
                          <Option key={elem} value={elem}>{elem}</Option>
                        );
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={11} offset={1}>
                <FormItem>
                  <Input id="address" placeholder="详细地址" {...addressProps}></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={4}>
            <FormItem label="活动分类" required={true}  {...{labelCol: {span: 24}, wrapperCol: {span: 0}}}></FormItem>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={11}>
                <FormItem>
                  <Select allowClear {...firstActTypeProps} placeholder="活动大类">
                    {
                      this.state.firstacttype &&
                        this.state.firstacttype.map(function(elem, idx) {
                          return (
                            <Option key={elem} value={elem}>{elem}</Option>
                          );
                        })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col span={11} offset={2}>
                <FormItem>
                  <Select allowClear {...secondActTypeProps} placeholder="活动小类">
                    {
                      this.state.secondacttype &&
                        this.state.secondacttype.map(function(elem) {
                          return (
                            <Option key={elem} value={elem}>{elem}</Option>
                          );
                        })
                    }
                  </Select>
                </FormItem>
              </Col>
            </Row>

          </Col>
        </Row>

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
                          <Option key={elem} value={elem}>{elem}</Option>
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
                          <Option key={elem} value={elem}>{elem}</Option>
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

        <FormItem  label="活动详情" required={true} className="content-item"
          labelCol={{span: 4}} wrapperCol={{span: 14}}>
          <div>
            <input type="hidden" {...contentProps}/>
            <textarea id="editor" autofocus></textarea>
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
                    <Input name="imgUrl" placeholder="url" {...getFieldProps("contentImgUrl")}></Input>
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
                    <Input name="width" placeholder="宽" {...getFieldProps("contentImgWidth")}></Input>
                  </FormItem>
                </Col>
                <Col span={3} className="tc">
                  <span style={{"fontSize": 20}}>×</span>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Input name="height" placeholder="高" {...getFieldProps("contentImgHeight")}></Input>
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

AddActivity = createForm()(AddActivity);
export default AddActivity;

ReactMixin.onClass(AddActivity, Reflux.connect(activityStore, "key"));
