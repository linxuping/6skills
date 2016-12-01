import React, {PropTypes} from 'react';
import Weui from 'react-weui';
const { Msg, Footer, FooterLink, FooterLinks} = Weui;


export default class BusinessApplyNotPass extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const footer =
      <div className="weui_extra_area">
        <a className="weui_extra_text" href="#">重新申请</a>
      </div>
    return (
      <div className="during">
        <div className="weui_msg">
          <div className="weui_icon_area">
            <i className="weui_icon_warn weui_icon_msg"></i>
          </div>
          <div className="weui_text_area">
            <h2 className="weui_msg_title">申请失败</h2>
            <p className="weui_msg_desc">
              您的合作申请未通过，{this.props.description}
            </p>
          </div>
          <div className="weui_extra_area" onClick={this.props.signReset}>
            <a href="javascript:;">重新申请</a>
          </div>
        </div>

      </div>
    );
  }
}

BusinessApplyNotPass.propTypes = {

};
