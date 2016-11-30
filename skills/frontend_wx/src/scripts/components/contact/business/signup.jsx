import React, {PropTypes} from 'react';
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import Weui from 'react-weui';
const {Button, Cells, Cell, CellBody, CellFooter} = Weui;
import actions from '../../../actions/business-actions';
import store from '../../../stores/business-store';
import Upload from '../../../common/upload.jsx';
const $ = require("jquery")
require('jquery-validation')
import { alert } from '../../../common/dialog.jsx';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    hasLicense: 1,
    submitDisabled: false
  }

  licenseChangeHandler(e) {
    this.setState({hasLicense: e.target.value})
  }

  componentDidMount() {
    $("#signup-form").validate({
      rules: {
        business: {required: true},
        username: {required: true},
        phone: {required: true, digits: true, rangelength: [11, 11]}
      },
      messages: {
        business: {required: "请输入商户名称"},
        username: {required: "请输入联系人姓名"},
        phone: {
          required: "请输入联系人电话",
          digits: "请输入联系人电话",
          rangelength: "11位手机号码"
        }
      },
      submitHandler: function(form){
        if (form.img_iden && (form.img_iden.value == "" || form.img_iden.value == undefined)
          || form.img_licence && (form.img_licence.value == "" || form.img_licence.value == undefined)) {
          alert({
            content: "请先上传营业执照或身份证！"
          })
        } else {
          actions.postApply(this, form)
        }
      }.bind(this)
    })
  }

  render() {
    return (
      <div className="signup business-page">
        <header className="title">合作申请</header>
        <form action="/business/auth" id="signup-form" method="post">
          <div className="weui_cells_title">是否有营业执照</div>
          <div className="weui_cells weui_cells_radio">
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                  <p>是</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="hasLicense"
                  value="1" defaultChecked="checked" onChange={this.licenseChangeHandler.bind(this)}/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                <p>否</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="hasLicense"
                  value="0" onChange={this.licenseChangeHandler.bind(this)}/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>
          </div>
          <div className="weui_cells weui_cells_form">
            {
              this.state.hasLicense > 0 ?
                <Upload uploadKey="business-img" label="营业执照" name="img_licence"></Upload> :
                <Upload uploadKey="business-img" label="身份证照片" name="img_iden"></Upload>
            }

            <div className="weui_cell">
              <div className="weui_cell_hd">
                <label htmlFor="business" className="weui_label">商户名称</label>
              </div>
              <div className="weui_cell_bd weui_cell_primary">
                <input type="text" name="business" id="business" className="weui_input"
                  placeholder="请输入商户名称"/>
              </div>
            </div>

            <div className="weui_cell">
              <div className="weui_cell_hd">
                <label htmlFor="username" className="weui_label">联系人姓名</label>
              </div>
              <div className="weui_cell_bd weui_cell_primary">
                <input type="text" name="username" id="username" className="weui_input"
                  placeholder="请输入联系人姓名"/>
              </div>
            </div>

            <div className="weui_cell">
              <div className="weui_cell_hd">
                <label htmlFor="phone" className="weui_label">联系人电话</label>
              </div>
              <div className="weui_cell_bd weui_cell_primary">
                <input type="text" name="phone" id="phone" className="weui_input"
                  placeholder="请输入联系人电话"/>
              </div>
            </div>

          </div>

          <div className="weui_btn_area">
            <Button type="primary" disabled={this.state.submitDisabled}>
              提交
            </Button>
          </div>

        </form>
      </div>
    );
  }
}


ReactMixin.onClass(Signup, Reflux.connect(store, "key"));
