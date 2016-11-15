import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import auditAction from '../../actions/audit-action.jsx';
import auditStore from '../../stores/audit-store.jsx';
import moment from 'moment';

import {Table, Popconfirm, Spin, Popover, Icon, notification} from 'antd';

export default class AuditList extends Component {
  constructor(props) {
    super(props);
  }


  state = {
    loaded: false,
    columns: [
      {title: "商户名称", dataIndex: "name", key: "name"},
      {title: "商户手机", dataIndex: "phone", key: "phone"},
      {title: "申请时间", dataIndex: "time", key: "time",
        render: (text, record) => (
          <span>
            {moment(record.time).format("YYYY-MM-DD HH:mm")}
          </span>
        )
      },
      {title: "操作", key: "operation", render: (text, record) => (
        <span>
          <Popconfirm title={ "确定通过商户\"" + record.name + "\"的申请吗？" }
            okText="是" cancelText="否" onConfirm={this.passHandler.bind(this, record)}>
            <a href="javascript:;">通过</a>
          </Popconfirm>
          <span className="ant-divider"></span>
            <Popconfirm
              title={ <span>确定拒绝商户<span>"{record.name}"</span>的申请吗？
                        <br></br>
                        <span className="ant-input-wrapper">
                          <input type="text" placeholder="拒绝理由" className="mt5 ant-input" id={"rejectref_" + record.id} style={{width: 180}}/>
                        </span>
                      </span>
                    }
              okText="是" cancelText="否" onConfirm={this.rejectHandler.bind(this, record)} >
              <a href="javascript:;">拒绝</a>
            </Popconfirm>
        </span>
      )}
    ]
  }

  rejectHandler(record){
    let desc = document.getElementById("rejectref_" + record.id).value;
    if (desc == "") {
      notification["error"]({
        message: '提示',
        description: '请填写拒绝理由！',
      })
    } else {
      auditAction.authHandler(this,
        {
          id: this.props.params.id,
          type: "deny",
          desc: desc
        });
    }
  }

  passHandler(record, e){
    auditAction.authHandler(this, {id: record.id, type: "pass"})
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
