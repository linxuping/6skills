import React, {PropTypes} from 'react';
import ReactDom from "react-dom";
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import Weui from 'react-weui';
const {Toast} = Weui;
import actions from '../../actions/activities-actions';
import store from '../../stores/activities-store';
import Back from '../../common/back.jsx';
import utils from '../../common/utils';
import { confirm, alert } from '../../common/dialog.jsx';

export default class Detail extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    //获取具体信息
    actions.fetchActivityDetails(this, {actid: this.props.params.actid})
    //报名等状态
    actions.fetchSignupStatus(this, {actid: this.props.params.actid})
  }

  collectHandler(ev){
    var _oid = utils.getopenid(1);
		if ("undefined" == _oid || null == _oid){
      confirm({
        content: "请先关注公众号再查看.",
        onOk: ()=>{
          utils.jump_pubnum();
        }
      })
    } else if (this.state.coll_status) {
      alert({
        content: "已收藏该活动，请到我的收藏中查看！",
      });
    } else {
      //收藏
      actions.collectPost(this, {actid: this.props.params.actid}, ev.target)
    }
  }

  render() {
    if (this.state.loaded) {
      let activity = this.state.activity;
      let hid_price = activity.actid==90;
      return (
        <div className="activity-detail">
          <Back title="活动详情"></Back>
          <article className="media">
            <div className="media-hd" ref="coverBox">
              <img src={activity.img_cover} alt=""/>
            </div>
            <div className="weui_panel header-msg">
              <div className="weui_panel_bd " >
                <h4 className="title">{activity.title}</h4>

                <div className="money clearfix ot-msg">
                  {
                    (activity.price_child_pre==null)? ""
                      :
                      <span className="now fl">现价：<span className="cost">￥{activity.price_child_pre}元</span></span>
                    }
                  <span className={(activity.price_child_pre!=null) ? "original fr has-pre" : "original"} style={{display: hid_price && "none"}}>
                    {activity.price_child_pre != null ? "原价" : "价格"}：
                    <span className="cost">
                      {activity.price_child == 0 ? "免费" :
                        <span>￥{activity.price_child}元</span>}
                    </span>
                  </span>
                </div>

                <div className="ot-msg"><span>年龄：{activity.ages}岁</span></div>
                <div className="ot-msg">活动时间：{activity.time_from} ~ {activity.time_to}</div>
                <div className="ot-msg">活动地点：{activity.area} {activity.position_details}</div>
                <div className="ot-msg">剩余名额：{(activity.quantities_remain>1000000) ? "不限":<font>{activity.quantities_remain}</font>}</div>
              </div>
            </div>

            <div className="weui_panel" style={{marginTop: "10px", padding:"20px 10px"}}>
              <div className="weui_panel_bd detail-content" dangerouslySetInnerHTML={{__html: activity.content}}>
              </div>
            </div>
            {
              this.state.status && this.state.qrcode ?
              <div className="QrCode" id="qrcode">
                <div className="qrcode-box">
                  <div className="tip">
                    <img src={this.state.qrcode} alt=""/>
                    <p>长按二维码加入活动微信群</p>
                  </div>
                </div>
              </div> : ""
            }
          </article>
          <div className="sign-btn" style={{"cursor": "pointer"}}
               onClick={this::this.collectHandler}>
            {
              this.state.coll_status ? "已收藏" : "收藏"
            }
          </div>
          <div className="sign-btn-right">
            {
              this.state.expire ||this.state.status == 1 || this.state.status == 2 ?
              <span>
                {
                  this.state.expire ? "已过期" :
                    (this.state.status == 1 ? "已报名" :
                      (this.state.status == 2 ? "付款" : ""))
                }
              </span>
              :
              <Link to={`/activities/${activity.actid}/signup`}>
                {
                  this.state.expire ? "已过期" :
                    (this.state.status == 1 ? "已报名" :
                      (this.state.status == 2 ? "付款" : "我要报名"))
                }
              </Link>
            }
          </div>
        </div>
      );
    }  else {
      return( <Toast icon="loading" show={true}>加载中...</Toast>)
    }
  }
}

Detail.propTypes = {
};

ReactMixin.onClass(Detail, Reflux.connect(store, "key"));
