import React, { Component, PropTypes } from 'react';

class AddComment extends Component {
  static propTypes = {
      className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="add-comment">
        添加评论
      </div>
    );
  }
}

export default AddComment;
