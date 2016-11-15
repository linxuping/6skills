import React, {PropTypes} from 'react'
import ReactDom from "react-dom";
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import WeUI from 'react-weui'
const {Panel, PanelBody} = WeUI

import actions from '../../actions/activities-actions';
import store from '../../stores/activities-store';

export default class Navication extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    btns: []
  }

  componentDidMount() {
    actions.fetchTypes(this)
  }

  render() {
    let btns = this.state.btns;
    return (
      <Panel className="mt0">
        <PanelBody>
          <div className="ss-flex">
            {
              btns && btns.map((elem, index) => {
              	return (
                  <div className="ss-flex-item nav-item" key={index}>
                    <Link to={"/activities?acttype=" + encodeURIComponent(elem)}>
                      <img src={require("img/icon_0" + (index + 1) + ".gif")} alt=""/>
                      <div className="clear"></div>
                      <span className="text">{elem}</span>
                    </Link>
                  </div>
                );
              })
            }
          </div>
        </PanelBody>
      </Panel>
    );
  }
}

ReactMixin.onClass(Navication, Reflux.connect(store, "types"));
