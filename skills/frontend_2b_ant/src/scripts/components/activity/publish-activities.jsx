import React, { Component, PropTypes } from 'react';
import {Table} from 'antd';

class PublishActivities extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  state = {
    columns: [
      {title: "活动", dataIndex: "title", key: "title"},
      {title: "活动发布时间", dataIndex: "publish_time", key: "publish_time",
        render: (text, record) => (
          <span>
            {new Date(record.publish_time).Format("yyyy-MM-dd hh:mm")}
          </span>
        )
      },
      {title: "链接", dataIndex: "link", key: "link"},
      {title: "报名人数", dataIndex: "sign_num", key: "sign_num"},
      {title: "操作", key: "operation", render: (text, record) => (
        <span>
          <a href="#">下线</a>
          <span className="ant-divider"></span>
          <a href="#">查看报名信息</a>
          <span className="ant-divider"></span>
          <a href="#">替换群二维码</a>
        </span>
      )}
    ]
  };

  render() {
    const data = [];
    for (var i = 0; i < 15; i++) {
      data.push({id: i, title: "上海迪士尼亲子活动" + i, publish_time: 1472660806815, sign_num: 20});
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

export default PublishActivities;
