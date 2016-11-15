import React , {PropTypes} from "react";
import ReactDom from "react-dom";
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from "react-router";
import Carousel from './carousel.jsx';
import Navigation from './navigation.jsx';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Index">
				<Carousel></Carousel>
				<Navigation></Navigation>
				{/*<Activities activities={this.state.activities}
					app={this} scrollArea=".Index"></Activities>*/}
			</div>
    );
  }
}

Home.propTypes = {
};
