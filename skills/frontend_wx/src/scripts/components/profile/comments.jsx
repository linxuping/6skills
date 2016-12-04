import React, { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import {Link} from 'react-router';
import actions from '../../actions/profile-actions.js';
import store from '../../stores/profile-store.js';
import Back from '../../common/back.jsx';
import WeUI from 'react-weui';
const {Button, Toast} = WeUI;

class Comments extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    actions.fetchMyActivities(this, false, 'my')
  }

  render() {
    let activities = this.state.activities || [];
    return (
      <div className="myActivities">
        <Back>我的评论</Back>
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
                      <Link to={`/profile/comment?actid=${elem.actid}&commentid=${elem.commentid}`}>
                        <Button type="default" plain size="small">
                          {(elem.commentid==undefined) ? "评论": "修改评论"}
                        </Button>
                      </Link>
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

export default Comments;

ReactMixin.onClass(Comments, Reflux.connect(store, 'key'));
