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
        <Msg type="waiting"
             title="申请中"
             description="您的合作申请正在处理中，请耐心等待结果。"
             footer={this.props.footer}>
        </Msg>
      </div>
    );
  }
}

BusinessDuring.propTypes = {
};
