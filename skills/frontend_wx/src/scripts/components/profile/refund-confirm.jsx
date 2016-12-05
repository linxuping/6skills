import React, { Component } from 'react';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Back from '../../common/back.jsx';
import Weui from 'react-weui';
const {ButtonArea, Button} = Weui;
const $ = require('jquery');
import actions from '../../actions/profile-actions';
import store from '../../stores/profile-store';

export default class RefundConfirm extends React.Component {

	state = {
		disabled: false
	}

	submitHandler(e) {
		e.preventDefault();
		let reason = $("input[name='reason']:checked").val();
    if (reason.indexOf("其他原因") != -1){
      reason = $("#other_reason")[0].value;
    }

		actions.postRefund(this, {pid: this.props.params.pid, reason: reason})

	}

	render() {
		return (
			<div className="pay-page">
				<Back>退款原因</Back>
				<form action="#" method="post" id="withdraw-form">
          <div className="weui_cells weui_cells_radio">
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                <p>没时间参加</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="reason"
                  value="没时间参加" defaultChecked="checked"/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                <p>无理由退款</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="reason"
                  value="无理由退款"/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>
            <label className="weui_cell weui_check_label" for="x11">
              <div className="weui_cell_bd weui_cell_primary">
                <p>其他原因，请在下方输入</p>
              </div>
              <div className="weui_cell_ft">
                <input type="radio" className="weui_check" name="reason"
                  value="其他原因，请在下方输入"/>
                <span className="weui_icon_checked"></span>
              </div>
            </label>

            <div className="weui_cell">
              <div className="weui_cell_bd" style={{width: "100%"}}>
                <textarea name="other_reason" id="other_reason" rows="3" className="weui_textarea"
                  placeholder="退款原因"></textarea>
              </div>
            </div>
          </div>

          <ButtonArea>
						<Button type="primary" onClick={this.submitHandler.bind(this)}
							disabled={this.state.disabled}>
							提交
						</Button>
          </ButtonArea>
        </form>
			</div>
		)
	}
}


ReactMixin.onClass(RefundConfirm, Reflux.connect(store, "key"));
