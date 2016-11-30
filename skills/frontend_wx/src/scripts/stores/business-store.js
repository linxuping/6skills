import Reflux from "Reflux";
import actions from '../actions/business-actions';
import service from '../services/business-service';
import { alert } from '../common/dialog.jsx';

let businessStore = Reflux.createStore({

  listenables: [actions],

  onFetchBusinessStatus(that, params){

    service.fetchBusinessStatus(params, (res) => {
      switch (res.status) {
        case 1:
          require.ensure([], (require)=>{
            const Appling = require('../components/contact/business/appling.jsx').default;
            that.setState({
              description: res.description,
              status: res.status,
              loaded: true,
              component: Appling
            });
          }, "business.applying")
          break;
        case 2:
          require.ensure([], (require)=>{
            const Pass = require('../components/contact/business/apply-pass.jsx').default;
            that.setState({
              description: res.description,
              status: res.status,
              loaded: true,
              component: Pass
            });
          }, "business.pass")
          break;
        case 3:
          require.ensure([], (require)=>{
            const NotPass = require('../components/contact/business/apply-not-pass.jsx').default;
            that.setState({
              description: res.description,
              status: res.status,
              loaded: true,
              component: NotPass
            });
          }, "business.notpass")
          break;
        default:
          require.ensure([], (require)=>{
            const Signup = require('../components/contact/business/signup.jsx').default;
            that.setState({
              loaded: true,
              component: Signup
            });
          }, "business.signup")
      }

    })
  },

  onPostApply(that, form) {
    that.setState({
      submitDisabled: true
    });
    let params;
    if (form.img_licence) {
      params = {
        img_licence: form.img_licence.value,
        img_iden: form.img_licence.value,
        business: form.business.value,
        username: form.username.value,
        phone: form.phone.value
      }
    } else {
      params = {
        img_licence: form.img_iden.value,
        img_iden: form.img_iden.value,
        business: form.business.value,
        username: form.username.value,
        phone: form.phone.value
      }
    }
    service.postApply(params, (value) => {
      location.href = "#/contact/business"
    }, (err)=>{
      alert({
        content: err.errmsg,
        onOk: ()=>{
          that.setState({
            submitDisabled: false
          });
        }
      });
    })
  }

});

export default businessStore;
