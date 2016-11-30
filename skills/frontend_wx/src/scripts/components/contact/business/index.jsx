import React, {PropTypes} from 'react';
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import Back from '../../../common/back.jsx';
import Weui from 'react-weui';
const {Toast} = Weui;
import actions from '../../../actions/business-actions';
import store from '../../../stores/business-store';

export default class Business extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    actions.fetchBusinessStatus(this)
  }

  render() {
    const ComponentToMount = this.state.component;
    return (
      <div className="cooperation mt120">
        <Back></Back>
        {
          this.state.loaded ?
            <ComponentToMount description={this.state.description}></ComponentToMount>
          : <Toast icon="loading" show={true}>加载中...</Toast>
        }
      </div>
    );
  }
}


module.exports = Business;
ReactMixin.onClass(Business, Reflux.connect(store, "key"));
