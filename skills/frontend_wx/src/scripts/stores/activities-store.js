import Reflux from "Reflux";
import actions from '../actions/activities-actions';
import service from '../services/activities-service';
import {confirm, alert} from '../common/dialog.jsx'

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
  onFetchActivityDetails(that, params){
    service.fetchActivityDetails(params, (res)=>{
      that.setState({
        activity: res,
        loaded: true,
        signtype: res.sign_type || 1,
        imgs: res.imgs,
      })
      this.fetchJsSignature(that);
    })
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
  }

});

export default store;
