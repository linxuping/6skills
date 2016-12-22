import React , {PropTypes} from "react";
import ReactDom from "react-dom";
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import Carousel from './carousel.jsx';
import Navigation from './navigation.jsx';
import Activities from '../activities/list.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Index">
        <Carousel />
        <Navigation />
        <Activities scrollArea=".Index" />
      </div>
    );
  }
}

Home.propTypes = {
};
