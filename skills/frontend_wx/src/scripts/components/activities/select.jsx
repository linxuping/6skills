import React, {PropTypes} from 'react';
import Reflux from 'Reflux';
import ReactMixin from 'react-mixin';
import actions from '../../actions/activities-actions';
import store from '../../stores/activities-store';


export default class Select extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    values: [],
    loaded: false
  }

  componentDidMount() {
    if (this.props.url) {
      actions.fetchFilter(this, this.props.url);
    } else {
      this.setState({
        values: this.props.values
      });
    }
  }

  labelClick(){
    this.setState({
      showSheet: !this.state.showSheet
    });
  }

  hideSheet(){
    this.setState({
      showSheet: false
    });
  }

  selectHandler(e){
    var value = e.target.dataset.menu;
    this.setState({
      label: value
    });
    this.props.selectHandler && this.props.selectHandler(this.props.name, value);
  }

  render() {
    var text = this.props.text || this.state.values && this.state.values[0];
    if (this.state.label) {
      text = this.state.label
    }
    return (
      <div className="selecter">
        <div className="tt" onClick={this::this.labelClick}>
          <div className="txt">{text}</div>
          <div className="tri"></div>
        </div>
        <div className="actionsheet-wrap">
          <div className={this.state.showSheet ? "weui_mask_transition show" : "weui_mask_transition "} onClick={this::this.hideSheet}>
            <div className={this.state.showSheet ? "weui_actionsheet weui_actionsheet_toggle" : "weui_actionsheet"}>
              <div className="weui_actionsheet_menu">
                {
                  this.state.values && this.state.values.length > 0 ?
                  this.state.values.map(function(elem, index) {
                    return (
                      <div className="weui_actionsheet_cell" key={index} data-menu={elem}
                        onClick={this.selectHandler.bind(this)} data-name={this.props.name}>
                        {elem}
                      </div>
                    );
                  }.bind(this))
                  :
                  <div className="weui_actionsheet_cell" value="*">
                    暂无数据
                  </div>
                }
              </div>
              <div className="weui_actionsheet_action">
                <div className="weui_actionsheet_cell" value="*" onClick={this::this.hideSheet}>
                  取消
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Select.propTypes = {
  selectHandler: PropTypes.func
};

ReactMixin.onClass(Select, Reflux.connect(store, "key"));
