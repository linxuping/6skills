var Pay = React.createClass({

  closeHandler: function() {
    document.title = this.props.backTitle;
    ReactDOM.unmountComponentAtNode(document.getElementById("pay-page-wrap"));
  },

  payHandler: function(e) {
    var price = e.target.dataset.price;
    //price = 0.01;
    $('#paybtn')[0].disabled = true;
    $('#paybtn')[0].innerText = "正在支付...";
    $.ajax({
      url: ges('get_wx_payinfo'),
      type: 'get',
      dataType: 'json',
      data: { "openid":geopenid(),"actid": this.props.activity. actid || getUrlParam("actid"),"price":price },
    })
    .done(function(res) {
      if (res.errcode == 0){
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.appid, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.noncestr, // 必填，生成签名的随机串
          signature: res.sign,// 必填，签名，见附录1
          jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function(){
          var _ts = res.timestamp;
          function onBridgeReady(){
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId" : res.appid,     //公众号名称，由商户传入     
                "timeStamp": _ts,         //时间戳，自1970年以来的秒数     
                "nonceStr" : res.noncestr, //随机串     
                "package" : "prepay_id="+res.prepay_id,     
                "signType" : "MD5",         //微信签名方式：     
                "paySign" : res.paysign //微信签名 
              },
              function(res){     
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                  $('#paybtn')[0].disabled = true;
                  $('#paybtn')[0].style.backgroundColor = "gray";
                  $('#paybtn')[0].innerText = "已支付";
                  return;//alert("pay ok.");
                }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                else
                  ;//alert(res.err_msg);
              }
            ); 
          }
          if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
          }else{
            onBridgeReady();
          }
        });
        wx.error(function(res2){
          alert('支付配置错误.');
        });
      }
    }.bind(this))
    .fail(function() {
      console.log("无法获取支付信息。");
    })
    .always(function() {
      ;//console.log("complete");
    });
    $('#paybtn')[0].disabled = false;
    $('#paybtn')[0].innerText = "支付";
  },

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
          {this.props.price ? this.props.price : (this.props.activity.sign_type == "3" ? 
            sign3Price[this.props.major] : this.props.activity.price_child)}元</p>
        </section>
        <div className="weui_btn_area ss-btn-area mb20">
          <button id="paybtn" type="button" className="weui_btn weui_btn_primary" onClick={this.payHandler} data-price={this.props.activity.sign_type == "3" ? sign3Price[this.props.major] : this.props.activity.price_child}>支付</button>
        </div>
      </div>
    );
  }
});
