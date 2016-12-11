import React, {PropTypes} from 'react';
import utils from '../common/utils';
import Weui from 'react-weui';
const {Toast} = Weui;

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    if (utils.getUrlParam("notNeedOpenid")) {
      this.setState({
        loaded: true
      });
    } else {
      if (utils.getUrlParam("code")) {
        utils.load_6soid(this)
      } else {
        this.setState({
          loaded: true
        });
      }
    }
  }

  render() {
    const {children} = this.props;
    return (
      <div className="container">
        {this.state.loaded ? children : <Toast icon="loading" show={true}>加载中...</Toast>}
        <div id="msg-wrap"></div>
      </div>
    );
  }
}
