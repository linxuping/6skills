import React, {PropTypes} from 'react';
import Weui from 'react-weui';
const { Msg } = Weui;

export default class BusinessDuring extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="during">
        <header className="title">合作申请</header>
        <Msg type="success"
             title="申请成功"
             description="您的合作申请已通过，恭喜您。您现在可以联系我们的客服上传课程和活动了。"
             footer={this.props.footer}>
        </Msg>
      </div>
    );
  }
}

BusinessDuring.propTypes = {
};
