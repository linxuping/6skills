import React, {PropTypes} from 'react';
import Weui from 'react-weui';
const { Msg } = Weui;

export default class BusinessApplyNotPass extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="during">
        <header className="title">合作申请</header>
        <Msg type="warn"
             title="申请失败"
             description={`您的合作申请未通过,${this.props.description}`}
             footer={this.props.footer}>
        </Msg>
      </div>
    );
  }
}

BusinessApplyNotPass.propTypes = {
};
