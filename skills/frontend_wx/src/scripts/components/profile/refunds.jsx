import React, {PropTypes} from 'react';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Back from '../../common/back.jsx';
import WeUI from 'react-weui';
const {Toast} = WeUI;
import actions from '../../actions/profile-actions';
import store from '../../stores/profile-store';


export default class NonPayments extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    actions.fetchMyActivities(this);
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
                        <div className="time clearfix">
                          <span>报名时间</span><time>{elem.time_signup}</time>
                        </div>
                      </Link>
                      <Button type="default" plain size="small"
                        onClick={this.delunPayActivity.bind(this, elem.signid)}>
                        取消报名
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

NonPayments.propTypes = {
};

ReactMixin.onClass(NonPayments, Reflux.connect(store, "key"));
