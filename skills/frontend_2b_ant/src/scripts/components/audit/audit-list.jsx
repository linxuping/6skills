import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import auditAction from '../../actions/audit-action.jsx';
import auditStore from '../../stores/audit-store.jsx';


import {Table, Popconfirm, Spin} from 'antd';

export default class AuditList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loaded: false,
    business: []
  }

  componentDidMount() {
    if (!this.props.children) {
      auditAction.fatchAudits(this, {page: 1, pagesize: 10});
    }
  }

  render() {
    if (this.props.children) {
      return this.props.children;
    } else {
      if (this.state.loaded) {
        let pagination = {
          total: this.state.pageable.total*10,
          showSizeChanger: true,
          onShowSizeChange(current, pagesige) {
            console.log('Current: ', current, '; pagesige: ', pagesige);
          },
          onChange(current) {
            console.log('Current: ', current);
          },
        };
        return (
          <Table columns={this.state.columns} dataSource={this.state.business}
            pagination={pagination}/>
        );
      } else {
        return (<div className="loading">加载中</div>)
      }

    }
  }
}

ReactMixin.onClass(AuditList, Reflux.connect(auditStore, "key"));
