var Comments = React.createClass({

  getInitialState: function() {
    return {
      comments: []
    };
  },

  opCommentDetailPage: function(comment){
    ReactDOM.render(
      <Comment comment={comment}></Comment>
      , document.getElementById('comment-page-wrap')
    )
  },

  componentDidMount: function() {
    $.ajax({
      url: '/sign/comment/list',
      type: 'get',
      dataType: 'json',
      data: {actid: this.props.actid}
    })
    .done(function(res) {
      console.log("success");
      if (res.errcode == 0) {
        this.setState({
          comments: res.activities
        });
      }
    }.bind(this))
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  },

  render () {
    var comments = this.state.comments;
    return (
      <div className="comments">
        <div className="weui_panel">
          <div className="weui_panel_bd">
            {
              comments.map(function(item, idx){
                return (
                  <div className="weui_media_box weui_media_appmsg" key={idx}
                       onClick={this.opCommentDetailPage.bind(this, item)}>
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
        <div id="comment-page-wrap"></div>
      </div>
    )
  }
})
