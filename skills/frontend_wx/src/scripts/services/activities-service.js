import Service from './service';

class ActivitieService extends Service {
  constructor() {
    super()
  }

  fetchHotActivities(cb){
    this.fetch("/activities/hot/list", null, cb);
  }

  fetchTypes(cb){
    this.fetch('/wx/acttypes/list',null,cb);
  }
}


export default new ActivitieService();
