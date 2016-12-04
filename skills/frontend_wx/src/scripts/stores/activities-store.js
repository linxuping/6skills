import Reflux from "Reflux";
import actions from '../actions/activities-actions';
import service from '../services/activities-service';
import {confirm, alert} from '../common/dialog.jsx'
import utils from '../common/utils';

let store = Reflux.createStore({

  listenables: [actions],

  onFetchHotActivities(that){
    if (sessionStorage.getItem("_home_hotactivities") == undefined) {
      service.fetchHotActivities((data)=>{
        that.setState({
          activities: data.activities
        })
        sessionStorage.setItem("_home_hotactivities", JSON.stringify(data.activities));
      })
    } else {
      let activities = JSON.parse(sessionStorage.getItem("_home_hotactivities"));
      that.setState({
        activities: activities
      })
    }

  },

  onFetchFilter(that, url){
    if (sessionStorage.getItem(url) == undefined) {
      service.fetchFilter(url, (data)=>{
        that.setState({
          values: data.values
        })
        sessionStorage.setItem(url, JSON.stringify(data.values));
      })
    } else {
      let values = JSON.parse(sessionStorage.getItem(url));
      that.setState({
        values: values
      })
    }
  },

  /**
   * 获取活动列表
   */
  onFetchActivities(that, params, cb){
    service.fetchActivities(params, data=>{
      if (data.pageable.page == 1) {
        that.setState({
          activities: data.activities,
          pageable: data.pageable
        })
      } else {
        that.setState({
          activities: that.state.activities.concat(data.activities),
          pageable: data.pageable
        })
      }
      cb && cb();
    })
  },

  /**
   * 获取活动具体信息
   */
  onFetchActivityDetails(that, params, signature=true){
    if (sessionStorage.getItem(`_activity_detail_${params.actid}_`) == undefined) {
      service.fetchActivityDetails(params, (res)=>{
        that.setState({
          activity: res,
          loaded: true,
          signtype: res.sign_type || 1,
          imgs: res.imgs,
        })
        if (signature) {
          this.fetchJsSignature(that);
        }

        sessionStorage.setItem(`_activity_detail_${params.actid}_`, JSON.stringify(res))
      })
    } else {
      let res = JSON.parse(sessionStorage.getItem(`_activity_detail_${params.actid}_`))
      that.setState({
        activity: res,
        loaded: true,
        signtype: res.sign_type || 1,
        imgs: res.imgs,
      });
      if (signature) {
        this.fetchJsSignature(that);
      }
    }

  },

  /**
   * js sdk 签名
   */
  // TODO:
  fetchJsSignature(that){
    service.fetchJsSignature({url: location.href}, (res)=>{
      console.log(res);
    }, (err)=>{
      console.log(err);
    });
  },

  /**
   * 报名状态及收藏状态等等
   */
  onFetchSignupStatus(that, params){
    service.fetchSignupStatus(params, (res)=>{
      that.setState({
        status: res.status,
				expire: res.errmsg=="过期",
				price: res.price,
				major: res.major,
				coll_status: res.coll_status,
				qrcode: res.qrcode,
      })
    })
  },

  /**
   * 收藏
   */
  onCollectPost(that, params, target){
    service.collectPost(params, (res)=>{
      target.innerHTML = "已收藏";
      that.setState({coll_status: 1});
      //收藏成功后把缓存的数据清理掉
      sessionStorage.removeItem("_profile__collections_");
    }, (err)=>{
      alert({
        content: "收藏失败:" + err.errmsg
      })
    })
  },

  /**
   * 报名
   */
  onPostSignup(that, params){
    service.postSignup(params, (res)=>{
      sessionStorage.removeItem("_profile__activities_");
      sessionStorage.removeItem("_profile__unpays_");
      alert({
        content: "恭喜您报名成功！",
        onOk: ()=>{
          let activity = JSON.parse(sessionStorage.getItem(`_activity_detail_${params.actid}_`));
          if (activity.price_child > 0) {
            // 费用大于0，付费
            location.href = `#/activities/${params.actid}/pay`
          } else {
            // 无需付费，是否已经关注
            if (res.wxchat == "") {
              comfirm({
                content: "现在关注爱试课的公众号，可以查看更多活动和您的报名情况！",
                onOk: ()=>{
                  utils.try_jump_pubnum();
                }
              })
            }
            if (params.signid) {
              location.href = `#/profile/signinfo/${params.signid}?actid=${params.actid}`
            } else {
              location.href = `#/activities/${params.actid}`
            }
          }
        }
      })
    }, (err)=>{
      alert({
        content: `报名失败：${err.errmsg}`
      }),
      that.setState({
        disabled: false
      });
    })
  },

  /**
   * 获取报名信息
   */
  onFetchSigninfo(that, params){
    service.fetchSigninfo(params,(res) => {
      that.setState({
        signinfo: res,
        loaded: true
      });
    })
  },

  /**
   * 获取已有信息
   * @type {Boolean}
   */
  onFetchProfiles(that, params, isForce=false) {

    if (sessionStorage.getItem(`_signup_msg_${that.props.params.actid}_`) == undefined) {
      const profile = JSON.parse(sessionStorage.getItem("_profile__profile_"));
        that.setState({
          profile: profile,
        });
    } else {
      let profile;
      try {
        profile = JSON.parse(sessionStorage.getItem(`_signup_msg_${that.props.params.actid}_`));
        profile.name = profile.username_pa
      } catch (e) {
        profile =  utils.url2json(sessionStorage.getItem(`_signup_msg_${that.props.params.actid}_`));
      } finally {
        that.setState({
          profile: profile,
        });
      }
    }

    this.onFetchActivityDetails(that, {actid: that.props.params.actid}, false)
  },

  /**
   * 获取微信支付信息
   */
  onFetchWxPayInfo(that, params) {
    service.fetchWxPayInfo(params, (res)=>{
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appid, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.noncestr, // 必填，生成签名的随机串
        signature: res.sign,// 必填，签名，见附录1
        jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(()=>{
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
            (res)=>{
              if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                that.setState({
                  disabled: true,
                  payText: "已支付"
                });
                // 支付完成把这几个列表删除了，下次重新获取
                sessionStorage.removeItem('_profile__refunds_');
                sessionStorage.removeItem("_profile__activities_");
                sessionStorage.removeItem("_profile__unpays_");
                // $('#paybtn')[0].disabled = true;
                // $('#paybtn')[0].style.backgroundColor = "gray";
                // $('#paybtn')[0].innerText = "已支付";
                return;//alert("pay ok.");
              }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              else
                ;// alert({content: res.err_msg});
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
        alert({content: '支付配置错误.'});
      });
    })
  },

  /**
   * 详情页评论
   */
  onFetchComments(that, params) {
    service.fetchComments(params, (res)=>{
      that.setState({
        comments: res.activities
      });
    })
  }

});

export default store;
