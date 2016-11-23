import Reflux from "Reflux";
import actions from '../actions/profile-actions';
import profileService from '../services/profile-service';
import {alert} from '../common/dialog.jsx';

let profileStore = Reflux.createStore({

  listenables: [actions],

  /**
   * 获取用户信息
   * @isForce {Boolean}  is force update
   */
  onFetchUserInfo(that, isForce=false) {
    if (sessionStorage.getItem("_profile__profile_") == undefined || isForce) {
      profileService.fetchUserInfo((res)=>{
        if (res.errcode !== 0) {
          location.href = "#/verify"
        } else {
          that.setState({
            "username":res.profile.username,
            "phone":res.profile.phone,
            "img":res.profile.img
          })
          sessionStorage.setItem("_profile__profile_", JSON.stringify(res.profile));
        }
      })
    } else {
      let profile = JSON.parse(sessionStorage.getItem("_profile__profile_"));
      that.setState({
        "username":profile.username,
        "phone":profile.phone,
        "img":profile.img
      })
    }
  },

  /**
   * 获取已报名活动或未付款活动
   */
  onFetchMyActivities(that, isForce=false){
    let requestType, url;
    //我的活动
    if (that.props.location.pathname.indexOf("my") !== -1) {
      requestType = "my";
      url = "/activities/my"
    } else {
        requestType = "non-payments";
        url = '/activities/unpay/list'
    }
    if ((requestType == "my" && sessionStorage.getItem("_profile__activities_") == undefined)
        || (requestType == "non-payments" && sessionStorage.getItem("_profile__unpays_") == undefined)
        || isForce) {
      profileService.fetchMyActivities(url, {page:"1", pagesize:"100"}, (res)=>{
        that.setState({
          activities: res.activities,
          loaded: true
        })
        if (requestType == "my") {
          sessionStorage.setItem("_profile__activities_", JSON.stringify(res.activities));
        } else {
          sessionStorage.setItem("_profile__unpays_", JSON.stringify(res.activities));
        }
      })
    } else {
      let activities;
      if (requestType == "my") {
        activities = JSON.parse(sessionStorage.getItem("_profile__activities_"));
      } else {
        activities = JSON.parse(sessionStorage.getItem("_profile__unpays_"));
      }
      that.setState({
        activities: activities,
        loaded: true
      })
    }
  },

  /**
   * 取消报名
   */
  onResetSignup(that, params){
    profileService.resetSignup(params, ()=>{
      alert({
        content: "取消报名成功！",
        onOk: ()=>{
          this.onFetchMyActivities(that, true);
        }
      })
    }, (err)=>{
      alert({
        content: "取消报名失败:" + err.errmsg
      })
    })
  },

  /**
   * 获取收藏的活动
   */
  onFetchCollections(that, isForce){
    if (sessionStorage.getItem("_profile__collections_") == undefined || isForce) {
      profileService.fetchCollections({page:"1", pagesize:"100"}, (res)=>{
        that.setState({
          activities: res.activities,
          loaded: true
        })
        sessionStorage.setItem("_profile__collections_", JSON.stringify(res.activities));
      })
    } else {
      let activities = JSON.parse(sessionStorage.getItem("_profile__collections_"));
      that.setState({
        activities: activities,
        loaded: true
      })
    }
  },

  /**
   * 删除收藏活动
   * @param  {object} that compoent
   * @param  {[object]} params request obj
   * @return
   */
  onDelCollection(that, params){
    profileService.delCollection(params, ()=>{
      alert({
        content: "删除成功！",
        onOk: ()=>{
          this.onFetchCollections(that, true);
        }
      })
    }, (err)=>{
      alert({
        content: "删除失败:" + err.errmsg
      })
    })
  },

  /**
   * 认证获取验证码
   */
  onGetCode(that, params){
    profileService.getCode(params, (res)=>{
      this.countDown(that, 10)
    })
  },

  /**
   * 倒数
   */
  countDown: function(that, tm) {
    if (tm > 0) {
      that.setState({
        codeText: tm + "S",
        codeDisable: true
      });
      setTimeout(()=>{
        this.countDown(that, tm - 1);
      }, 1000);
    } else {
      that.setState({
        codeText: "获取验证码",
        codeDisable: false
      });
    }
  },

  /**
   * 验证手机
   */
  onVerifyPhone(that, form) {
    const params = {phone: form.phone.value, code: form.code.value}
    profileService.verifyPhone(params, (res)=>{
      //may be it need to set phone to _profile
      alert({
        content: "恭喜您验证成功！",
        onOk: ()=>{
          if (that.props.location.query.redirect_url) {
            location.href = that.props.location.query.redirect_url
          } else {
            history.back();
          }
        }
      })
    }, (err)=>{
      alert({
        content: err.errmsg,
        onOk: ()=>{
          that.setState({
            submitDisabled: false
          });
        }
      })
    })
  }

});

export default profileStore;
