import React, { Component, PropTypes } from 'react';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import Back from '../../common/back.jsx';
import Weui from 'react-weui';
const { Button, Cells, Cell, CellBody, CellFooter,Toast } = Weui;
import actions from '../../actions/profile-actions';
import store from '../../stores/profile-store';


class AddComment extends Component {
  static propTypes = {
      className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    loaded: false,
    point: 0
  }

  pointHandler (item){
		this.setState({
			point: item
		});
	}

  componentDidMount() {
    if (this.props.location.query.commentid) {
      actions.fetchComment(this, {commentid: this.props.location.query.commentid})
    } else {
      this.setState({
        loaded: true
      });
    }

  }

  submitHandler(ev){
    let comment = this.refs.comment.value;
    let params = {
      actid: this.props.location.query.actid,
      score: this.state.point,
      comment: comment
    }
    this.setState({
      submitDisabled: true
    });
    actions.postComment(this, params);
  }

  render() {
    let starlist = [1, 2, 3, 4, 5];
    let comment = this.state.comment || {};
    return (
      <div className="verify comment-page">
        <Back>评论</Back>
          {
            this.state.loaded ?
              <form action="#" method="post" id="comment-form">
                <div className="point-box">
                  <Cells style={{marginTop:0}}>
                    <div className="bd">
                      <h4 className="title fl">评分</h4>
                      <div className="txt fl">{this.state.point}星</div>
                      <div className="clearfix"></div>
                      <div className="icon-list">
                        {
                          starlist.map(function(item){
                            return <i className={item <= this.state.point ? "icon icon-heart-fill" : "icon icon-heart"} key={item}
                              onClick={this.pointHandler.bind(this, item)}></i>
                          }.bind(this))
                        }
                      </div>
                      <h4 className="title">评论</h4>
                    </div>
                    <Cell>
                      <CellBody>
                        <textarea name="comment" id="comment" rows="3"
                          className="weui_textarea" ref="comment" placeholder="评论"
                          defaultValue={comment.comment}></textarea>

                      </CellBody>
                    </Cell>
                  </Cells>
                </div>
                <div className="weui_btn_area">
                  <Button type="primary" onClick={this.submitHandler.bind(this)}
                    disabled={this.state.submitDisabled}>
                    提交
                  </Button>
                </div>
              </form>
              : <Toast icon="loading" show={true}>加载中...</Toast>

          }
      </div>
    );
  }
}

export default AddComment;
ReactMixin.onClass(AddComment, Reflux.connect(store, "key"));
