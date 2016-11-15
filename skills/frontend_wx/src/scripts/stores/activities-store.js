import Reflux from "Reflux";
import actions from '../actions/activities-actions';
import service from '../services/activities-service';

let store = Reflux.createStore({

  listenables: [actions],

  onFetchHotActivities(that){
    service.fetchHotActivities((data)=>{
      that.setState({
        activities: data.activities
      })
    })
  },

  onFetchTypes(that){
    if (sessionStorage.getItem("acitivtiesTypes") == undefined) {
      service.fetchTypes((data)=>{
        that.setState({
          btns: data.values
        })
        sessionStorage.setItem("acitivtiesTypes", JSON.stringify(data.values));
      })
    } else {
      let btns = JSON.parse(sessionStorage.getItem("acitivtiesTypes"));
      that.setState({
        btns: btns
      })
    }

  }

});

export default store;
