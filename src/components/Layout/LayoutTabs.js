import React from 'react';
import { Tabs } from 'antd';

import Todos from '../Todo/Todos';
import Users from '../User/Users';

import { log } from '../../shared/logger';

// TAGS
const TAG_LayoutTabs = 'LayoutTabs_FC';

const { TabPane } = Tabs;

function callback(key) {
  // this returns clicked "Tab" key
  // console.log(key);
}

function LayoutTabs() {
  log(TAG_LayoutTabs);

  return (
    <div className="LayoutTabs">
      <Tabs defaultActiveKey="1" onChange={callback} size="large">
        <TabPane tab="Todos" key="1">
          <Todos />
        </TabPane>
        <TabPane tab="Users" key="2">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default LayoutTabs;
