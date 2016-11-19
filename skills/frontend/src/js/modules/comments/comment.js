var Comment = React.createClass({

  back: function(){
    ReactDOM.unmountComponentAtNode(document.getElementById('comment-page-wrap'))
  },

  render () {
    var comment = this.props.comment;
    return (
      <div className="comments sign-page">
        <div className="back-btn" onClick={this.back}>评论详情</div>
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
    )
  }
})
