import React, { Component, PropTypes } from 'react';
import Back from '../../../common/back.jsx';

export default class CommentDetail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const comment = JSON.parse(sessionStorage.getItem("_activity_comment"));
    return (
      <div className="comments sign-page">
        <Back>评论详情</Back>
        <div className="weui_panel">
          <div className="weui_panel_bd">
            <div className="weui_media_box weui_media_appmsg">
              <div className="weui_media_hd">
                <img src={comment.headportrait}/>
              </div>
              <div className="weui_media_bd">
                <div className="weui_media_title clearfix">
                  <p className="fl">{comment.username || "匿名"}</p>
                </div>
                <div className="comment-dsc no-elipsis">
                  {comment.comment}
                </div>
                <time className="time">{comment.time} 回复</time>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
