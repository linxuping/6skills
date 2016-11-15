import React , {PropTypes} from "react";
import ReactDom from "react-dom";
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";


export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="index">
        index
      </div>
    );
  }
}

Home.propTypes = {
};
