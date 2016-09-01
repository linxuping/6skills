import React, { Component, PropTypes } from 'react';
import PublishActivities from './publish-activities.jsx';
import UnpublishActivities from './unpublish-activities.jsx';

import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;

class ActivityList extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="已发布活动" key="1">
          <PublishActivities />
        </TabPane>
        <TabPane tab="未发布活动" key="2">
          <UnpublishActivities />
        </TabPane>
      </Tabs>
    );
  }
}

export default ActivityList;
