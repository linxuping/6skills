import React, {PropTypes} from 'react';
import ReactDom from "react-dom";
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import Back from '../../common/back.jsx';
import actions from '../../actions/profile-actions';
import store from '../../stores/profile-store.js';
import WeUI from 'react-weui';
const {Button, Toast} = WeUI;
import {confirm, alert} from '../../common/dialog.jsx';

export default class Activities extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    actions.fetchMyActivities(this);
  }

  signResetHandler(signid){
    confirm({
      title: "取消报名提示",
      content: "您确定要取消该报名吗？",
      onOk: this.signResetConfirm.bind(this, signid)
    })
  }

  signResetConfirm(signid){
    actions.resetSignup(this, {signid: signid});
  }

  render() {
    let activities = this.state.activities || [];
    return (
      <div className="myActivities">
        <Back></Back>
        {
          this.state.loaded ?
          <div className="cell">
            <ul className="my-activities">
              {
                activities.map((elem, index) => {
                  return (
                    <li key={index}>
                      <Link to={`/activities/${elem.actid}`}>
                        <header className="ss-hd">{elem.title}</header>
                        <p className="time clearfix">
                          <span>课程时间</span><time>{elem.time_act}</time>
                        </p>
                        <div className="time clearfix">
                          <span>报名时间</span><time>{elem.time_signup}</time>
                        </div>
                      </Link>
                      <Link to={`/profile/signinfo/${elem.signid}`}>
                        <Button type="default" plain size="small" className="f-bt">
                          查看报名信息
                        </Button>
                      </Link>
                      <Button type="default" plain size="small"
                        onClick={this.signResetHandler.bind(this, elem.signid)}>
                        取消报名
                      </Button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          : <Toast icon="loading" show={true}>加载中...</Toast>
        }
      </div>
    );
  }
}

Activities.propTypes = {

};

ReactMixin.onClass(Activities, Reflux.connect(store, "key"));
