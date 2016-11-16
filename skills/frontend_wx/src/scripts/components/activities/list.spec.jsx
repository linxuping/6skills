import React, {PropTypes} from 'react';
import Activities from './list.jsx';
import { Link } from 'react-router';
import Selecter from './select.spec.jsx';

export default class ActivitiesList extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    acttype: this.props.location.query.acttype
  }

  componentDidMount() {

  }

  selectHandler(key, value){
    console.log(value);
    if (key == "area"){
      this.setState({
        area: value
      });
    } else if (key == "age"){
      if (value == "不限")
        this.setState({
          age: "0-100"
        });
      else
        this.setState({
          age: parseInt(value) + "-" + parseInt(value)
        });
    } else if (key == "acttype") {
      this.setState({
        acttype: value
      });
    }
  }

  render() {
    return (
      <div className="app">
        <Selecter acttype={this.state.acttype} selectHandler={this.selectHandler.bind(this)}></Selecter>
        <Activities acttype={this.state.acttype} age={this.state.age} area={this.state.area}/>
        <div className="paster">
          <Link to="/"><div className="top"></div></Link>
          <a href="me.html"><div className="bottom"></div></a>
        </div>
      </div>
    );
  }
}



ActivitiesList.propTypes = {
};
