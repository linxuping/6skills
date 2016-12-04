import React, {PropTypes} from 'react';
import ReactMixin from 'react-mixin';
import { Link } from 'react-router';
import Reflux from 'Reflux';
import Back from '../../common/back.jsx';
import WeUI from 'react-weui';
const {Toast, Button} = WeUI;
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
    actions.fetchRefunds(this, {page: 1 ,pagesize:100})
  }

  delunPayActivity() {

  }

  render() {
    var activities = this.state.activities || [];
    return (
      <div className="myActivities">
        <Back>申请退款</Back>
        <div className="tips">
          退款须知：如您希望取消课程报名并退款，请在课程开始时间的24小时之前及时发起申请。超时将无法自动退款，请联系人工客服处理。
        </div>
        {
          this.state.loaded ?
          <div className="cell">
            <ul className="my-activities mt10">
              {
                activities.map((elem, index) => {
                  return (
                    <li key={index}>
                      <Link to={`/activities/${elem.actid}`}>
                        <header className="ss-hd">{elem.title}</header>
                        <p className="time clearfix">
                          <span>课程时间</span><time>{elem.time}</time>
                        </p>
                      </Link>
                      <Button type="default" plain size="small"
                        onClick={this.delunPayActivity.bind(this, elem.signid)}>
                        {(elem.status==2) ? "等待退款":((elem.status==3) ? "已退款":"申请退款")}
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

ReactMixin.onClass(NonPayments, Reflux.connect(store, "key"));
