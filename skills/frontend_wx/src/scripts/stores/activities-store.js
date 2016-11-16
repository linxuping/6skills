import Reflux from "Reflux";
import actions from '../actions/activities-actions';
import service from '../services/activities-service';

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
  }

});

export default store;
