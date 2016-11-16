import React, {PropTypes} from 'react';
import WeUI from 'react-weui';
import ReactMixin from "react-mixin";
import Reflux from "Reflux";
import { Link } from 'react-router';
const {Panel, PanelBody, MediaBox, MediaBoxHeader, MediaBoxBody} = WeUI;
import actions from '../../actions/activities-actions';
import store from '../../stores/activities-store';
const $ = require('jquery');
import droploadFn from '../../common/dropload';
droploadFn($);

export default class Activities extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activities: [],
    age: this.props.age || "0-100",
    acttype: this.props.acttype || "全部",
    area: this.props.area || "全城",
    pageable:{
      page: 0,
      total: 1
    }
  }

  componentDidMount() {
    this.initPullAndFresh();
  }


  componentWillUpdate(nextProps, nextState) {
    let willUpdate = false
    if (nextProps.age!=undefined && nextProps.age != this.state.age) {
      willUpdate = true;
      this.state.age = nextProps.age;
    } else if (nextProps.acttype!=undefined && nextProps.acttype != this.state.acttype) {
      this.state.acttype = nextProps.acttype;
      willUpdate = true;
    } else if (nextProps.area!=undefined && nextProps.area != this.state.area) {
      this.state.area = nextProps.area;
      willUpdate = true;
    }

    if (willUpdate) {
      this.state.pageable.page = 0;
      this.state.pageable.total = 1;
      this.updateActivities();
    }

  }


  updateActivities(){
    console.log(this.state);
    const params = {
      acttype: this.state.acttype,
      area: this.state.area,
      age: this.state.age,
      pagesize: this.props.pagesize || 10,
      city: "*",
      district: "*",
      page: this.state.pageable.page+1
    };

    actions.fetchActivities(this, params, ()=>{
      this.state.dropload.noData(this.state.pageable.total <= this.state.pageable.page)
      this.state.dropload.resetload();
    });

  }

  initPullAndFresh(){
    var scrollArea = this.props.scrollArea || ".activities";
    this.state.dropload = $(scrollArea).dropload({
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
            domUpdate  : '<div class="dropload-update">↑释放更新</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData"></div>'
        },

        loadDownFn : function(me){

          if (this.state.pageable.total > this.state.pageable.page) {
            this.updateActivities();
          } else {
            this.state.dropload.noData(true)
            this.state.dropload.resetload();
          }
        }.bind(this)
    });
  }

  render() {
    return (
      <div className="activities">
        <ul className="activities-list lists">
          {
            this.state.activities.map(function(elem, index) {
              return (
                <li className="activity-item" key={index}>
                  <Link to={`/activities/${elem.actid}`}>
                  <Panel>
                    <PanelBody>
                      <MediaBox type="appmsg">
                        <MediaBoxHeader className="ss-media-hd">
                          <img className="weui_media_appmsg_thumb" src={elem.img_cover} alt=""/>
                          <div className="money">
                            {elem.price_child>0 ? ("￥" + Number(elem.price_child).toFixed(2)) : "免费"}
                          </div>
                        </MediaBoxHeader>
                        <MediaBoxBody className="ss-media-bd">
                          <h4 className="title">{elem.title}</h4>
                          <p className="fl ot">{elem.tags}</p>
                          <p className="fl ot">{elem.area}</p>
                          <p className="fl ot">{elem.ages}岁</p>
                        </MediaBoxBody>
                      </MediaBox>
                    </PanelBody>
                    {
                      elem.preinfo || elem.guarantee ?
                      <div className="weui_panel_bd">
                        <ul className="ttt">
                          {
                            elem.preinfo ?
                            <li className="tt clearfix">
                              <span className="pp red">限时</span>
                              <span className="txt">{elem.preinfo}</span>
                            </li> : ""
                          }
                          {
                            elem.guarantee ?
                            <li className="tt clearfix">
                              <span className="pp yellow">保障</span>
                              <span className="txt">{elem.guarantee}</span>
                            </li> : ""
                          }
                        </ul>
                      </div> : ""
                    }
                  </Panel>
                  </Link>
                </li>
              );
            }.bind(this))
          }
        </ul>
      </div>
    );
  }
}

Activities.propTypes = {
  scrollArea: PropTypes.string
};

ReactMixin.onClass(Activities, Reflux.connect(store, "key"));
