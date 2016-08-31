import React, { Component, PropTypes } from 'react';
import {Table} from 'antd';
require('../../commons/dataformat.js');

class UnpublishActivities extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    columns: [
      {title: "活动", dataIndex: "title", key: "title"},
      {title: "最后修改时间", dataIndex: "update_time", key: "update_time",
        render: (text, record) => (
          <span>
            {new Date(record.update_time).Format("yyyy-MM-dd hh:mm")}
          </span>
        )
      },
      {title: "操作", key: "operation", render: (text, record) => (
        <span>
          <a href="#">上线</a>
          <span className="ant-divider"></span>
          <a href="#">编辑</a>
          <span className="ant-divider"></span>
          <a href="#">删除</a>
        </span>
      )}
    ]
  };

  render() {
    const data = [];
    for (var i = 0; i < 7; i++) {
      data.push({id: i, title: "上海迪士尼亲子活动" + i, update_time: 1472660806815});
    };
    const pagination = {
      total: data.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange(current) {
        console.log('Current: ', current);
      },
    };
    return (
      <Table columns={this.state.columns} dataSource={data}
        pagination={pagination}/>
    );
  }
}

export default UnpublishActivities;
