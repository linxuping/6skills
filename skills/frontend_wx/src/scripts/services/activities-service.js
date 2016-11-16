import Service from './service';

class ActivitieService extends Service {
  constructor() {
    super()
  }

  fetchHotActivities(cb){
    this.fetch("/activities/hot/list", null, cb);
  }

  fetchFilter(url, cb){
    this.fetch(url || '/wx/acttypes/list',null,cb);
  }

  fetchActivities(params, cb){
    this.fetch('/activities/special-offers', params, cb);
  }
}


export default new ActivitieService();
