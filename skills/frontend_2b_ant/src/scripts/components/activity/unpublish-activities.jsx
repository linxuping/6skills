import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import ReactMixin from 'react-mixin';
import Reflux from 'Reflux';
import activityAction from '../../actions/activity-action.jsx';
import activityStore from '../../stores/activity-store.jsx';

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
    loaded: false,
    columns: [
      {title: "活动", dataIndex: "title", key: "title"},
      // {title: "最后修改时间", dataIndex: "update_time", key: "update_time",
      //   render: (text, record) => (
      //     <span>
      //       {new Date(record.update_time).Format("yyyy-MM-dd hh:mm")}
      //     </span>
      //   )
      // },
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

  componentDidMount() {
    let params = {page: 1, pagesize: 10}
    activityAction.fatchUnpublishActivities(this, params);
  }

  render() {
    // for (var i = 0; i < 7; i++) {
    //   data.push({id: i, title: "上海迪士尼亲子活动" + i, update_time: 1472660806815});
    // };
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

export default UnpublishActivities;
ReactMixin.onClass(UnpublishActivities, Reflux.connect(activityStore, "key"));
