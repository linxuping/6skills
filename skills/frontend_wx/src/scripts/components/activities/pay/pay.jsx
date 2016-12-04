import React, { Component, PropTypes } from 'react';
import Back from '../../../common/back.jsx';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Weui from 'react-weui';
const {Toast, Button} = Weui;
import actions from '../../../actions/activities-actions';
import store from '../../../stores/activities-store';

export default class Pay extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false,
    disabled: false
  }

  componentDidMount() {
    actions.fetchActivityDetails(this, {actid: this.props.params.actid})
  }

  payHandler(e) {
    const price = e.target.dataset.price;
    actions.fetchWxPayInfo(this, {actid: this.props.params.actid, price: price})
  }

  render() {
    const activity = this.state.activity || {}
    const sign3Price = {
      "声乐-个人初赛": 280,
      "声乐-团体初赛": 260,
      "器乐-个人钢琴初赛": 280,
      "器乐-个人小提琴初赛": 280,
      "器乐-个人古筝初赛": 280,
      "器乐-个人其他乐器初赛": 280,
      "器乐-团体钢琴初赛": 260,
      "器乐-团体小提琴初赛": 260,
      "器乐-团体古筝初赛": 260,
      "器乐-团体其他乐器初赛": 260,
      "舞蹈-个人初赛": 280,
      "舞蹈-团体初赛": 150,
      "语言-个人初赛": 280,
      "语言-团体初赛": 260,
      "书画-初赛": 0
    };
    let major = this.props.location.query.major;
    let _price = major ? sign3Price[major] : (activity.price ? activity.price:(activity.price_child_pre ? activity.price_child_pre:activity.price_child ));
    return (
      <div className="pay-page">
        <Back>付款</Back>
          {
            this.state.loaded ?
              <div>
                <section>
                  <h3 className="name">
                    报名{this.props.location.query.major ? "活动（科目）": "活动"}
                  </h3>
                  <p>
                    {activity.title}
                    {this.props.location.query.major ? <span>({this.props.location.query.major})</span> : ""}
                  </p>
                </section>
                <section>
                  <h3 className="name">总价</h3>
                  <p className="price">
                  ￥
                  {_price}元</p>
                </section>
                <div className="weui_btn_area">
                  <Button type="primary" onClick={this.payHandler.bind(this)}
                    disabled={this.state.disabled} data-price={_price}>
                    {this.state.payText || "付款"}
                  </Button>
                </div>
              </div>
              : <Toast icon="loading" show={true}>加载中...</Toast>
            }

      </div>
    );
  }
}

ReactMixin.onClass(Pay, Reflux.connect(store, "key"));
