import React, {PropTypes} from 'react';
import Selecter from './select.jsx';


export default class SelectContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var ages = ["不限"];
    for (var i = 1; i < 13; i++) {
      ages.push(i + "岁");
    }
    return (
      <div className="select-header">
        <Selecter name="acttype"
                  selectHandler={this.props.selectHandler}
                  text={this.props.acttype}
                  url="/wx/acttypes/list"/>
        <Selecter name="area"
                  selectHandler={this.props.selectHandler}
                  text="全城"
                  url="/wx/nearbyareas/list"/>
        <Selecter name="age"
                  selectHandler={this.props.selectHandler}
                  text="不限"
                  values={ages}/>
      </div>
    );
  }
}

SelectContainer.propTypes = {
  selectHandler: PropTypes.func
};
