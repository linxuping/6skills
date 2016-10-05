var Pay = React.createClass({

  closeHandler: function() {
    ReactDOM.unmountComponentAtNode(document.getElementById("pay-page-wrap"));
  },

  payHandler: function() {
    alert("支付接口")
  }

  render: function() {
    var sign3Price = {"舞蹈": 150, "声乐": 280, "器乐": 280, "语言": 280, "书画": 380};
    return (
      <div className="pay-page">
        <div className="back-btn" onClick={this.closeHandler}>
          付款
        </div>
        <section>
          <h3 className="name">报名{this.props.activity.sign_type == "3" ? "活动（科目）": "活动"}</h3>
          <p>
            {this.props.activity.title}
            {this.props.activity.sign_type == "3" ? <span>({this.props.major})</span> : ""}
          </p>
        </section>
        <section>
          <h3 className="name">总价</h3>
          <p className="price">
          ￥
          {this.props.activity.sign_type == "3" ? 
            sign3Price[this.props.major] : this.props.activity.price_child}元</p>
        </section>
        <div className="weui_btn_area mb20">
          <button type="button" className="weui_btn weui_btn_primary" onClick={this.payHandler}>支付</button>
        </div>
      </div>
    );
  }
});
