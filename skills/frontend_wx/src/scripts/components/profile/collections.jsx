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


export default class Collections extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentWillMount() {
    actions.fetchCollections(this)
  }

  delCollectionHandler(collid){
    confirm({
      content: "您确定要删除这个收藏吗？",
      onOk: this.delConfirm.bind(this, collid),
    })
  }

  delConfirm(collid){
    actions.delCollection(this, {collid: collid});
  }

  render() {
    var activities = this.state.activities || [];
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
                      </Link>
                      <Button type="default" plain size="small"
                        onClick={this.delCollectionHandler.bind(this, elem.collid)}>
                        删除
                      </Button>
                    </li>
                  )
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

ReactMixin.onClass(Collections, Reflux.connect(store, "key"));
