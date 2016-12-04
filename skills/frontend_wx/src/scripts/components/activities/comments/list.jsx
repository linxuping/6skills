import React, { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import { Link } from 'react-router';
import Reflux from 'Reflux';
import actions from '../../../actions/activities-actions';
import store from '../../../stores/activities-store';

export default class CommentList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    actions.fetchComments(this, {actid: this.props.actid})
  }

  openCommentDetailPage(comment) {
    sessionStorage.setItem("_activity_comment", JSON.stringify(comment))
    location.href = `#/activities/${this.props.actid}/comment`
  }

  render() {
    const comments = this.state.comments || [];
    return (
      <div className="comments">
        <div className="weui_panel">
          <div className="weui_panel_bd">
            {
              comments.map(function(item, idx){
                return (
                  <div className="weui_media_box weui_media_appmsg" key={idx}
                    onClick={this.openCommentDetailPage.bind(this, item)}>
                    <div className="weui_media_hd">
                      <img src={item.headportrait}/>
                    </div>
                    <div className="weui_media_bd">
                      <div className="weui_media_title clearfix">
                        <p className="fl">{item.username || "匿名"}</p>
                      </div>
                      <div className="weui_media_desc">
                        <div className="comment-dsc">
                          {item.comment}
                        </div>
                        <time className="time">{item.time} 回复</time>
                      </div>
                    </div>
                  </div>
                )
              }.bind(this))
            }
          </div>
        </div>
      </div>
    );
  }
}

ReactMixin.onClass(CommentList, Reflux.connect(store, "key"));
