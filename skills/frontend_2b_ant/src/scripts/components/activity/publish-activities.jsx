import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import activityAction from '../../actions/activity-action.jsx';
import activityStore from '../../stores/activity-store.jsx';

import {Table, Popconfirm} from 'antd';

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
      // {title: "链接", dataIndex: "link", key: "link"},
      {title: "报名人数", dataIndex: "sign_num", key: "sign_num"},
      {title: "操作", key: "operation", render: (text, record) => (

        <span>
          <Popconfirm title={"确定要下线\"" + record.title + "\""} okText="是" cancelText="否"
            onConfirm={this.offlineHandler.bind(this, record.actid)}>
            <a href="javascript:;">下线</a>
          </Popconfirm>
          <span className="ant-divider"></span>
          <a href="#">查看报名信息</a>
          <span className="ant-divider"></span>
          <a href="#">替换群二维码</a>
        </span>
      )}
    ]
  };

  offlineHandler(actid){
    activityAction.offLineActivity(this, actid);
  }

  componentDidMount() {
    this.fatchActivities();
  }

  fatchActivities(){
    let params = {page: 1, pagesize: 10}
    activityAction.fatchPublishActivities(this, params);
  }

  render() {
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
        <Table columns={this.state.columns} dataSource={this.state.activities}
          pagination={pagination}/>
      );
    } else {
      return (<p>加载中。。。</p>)
    }
  }
}

export default PublishActivities;

ReactMixin.onClass(PublishActivities, Reflux.connect(activityStore, "key"));
