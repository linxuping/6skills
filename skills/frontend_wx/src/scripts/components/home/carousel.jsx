import React, {PropTypes} from 'react';
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import action from '../../actions/activities-actions';
import store from '../../stores/activities-store';
var Slider = require('react-slick');
require('slick-carousel/slick/slick.less');

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activities: []
  }

  clickHandler(activity){
    location.href = `#/activities/${activity.id}`
  }

  componentDidMount() {
    action.fetchHotActivities(this);
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      speed: 500,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    let activities = this.state.activities;
    if (activities != null && activities.length > 0) {
      return (
        <div className="carousel">
          <Slider {...settings}>
            {
              activities && activities.map((elem, idx) => {
                return (
                  <div className="item" key={idx} onClick={this.clickHandler.bind(this, elem)}>
                    <img src={elem.img} />
                    <div className="title-box">
                      <h3 className="title">{elem.act_name || "标题"}</h3>
                    </div>
                  </div>
                );
              })
            }
          </Slider>
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

ReactMixin.onClass(Carousel, Reflux.connect(store, "key"));
