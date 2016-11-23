import React, {PropTypes} from 'react';
import WeUI from 'react-weui';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import { Link } from 'react-router';
const {Cells, Cell, CellBody, CellFooter} = WeUI;
import actions from '../../actions/profile-actions';
import store from '../../stores/profile-store';


export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    actions.fetchUserInfo(this);
  }

  state = {
    loaded: false,
    menus: [
      {name: "已报名课程", href: "/profile/activities"},
      {name: "我的收藏", href: "/profile/collections"},
      {name: "待付款", href: "/profile/non-payments"},
      {name: "申请退款", href: "/profile/refunds"},
      {name: "我的评论", href: "/profile/mycomments"}
    ]
  }

  render() {
    return (
      <div className="me">
        <div className="cell">
          <div className="hd tc">
            <img src={this.state.img} alt=""/>
            <p className="name">{this.state.username}</p>
          </div>
          <div className="bd" style={{marginTop: 150}}>
            <Cells access>
              {
                this.state.menus.map((item, idx) => {
                  return (
                    <Link to={item.href} key={idx} className="weui_cell">
                      <CellBody><p>{item.name}</p></CellBody>
                      <CellFooter></CellFooter>
                    </Link>
                  )
                })
              }
            </Cells>
          </div>
        </div>
      </div>
    );
  }
}

ReactMixin.onClass(Profile, Reflux.connect(store, "key"));
