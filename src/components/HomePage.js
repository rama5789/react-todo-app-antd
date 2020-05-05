import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import { log } from '../shared/logger';

import AddTodo from './Todo/AddTodo';
import AddUser from './User/AddUser';

const { TabPane } = Tabs;

// TAGS
const TAG_HomePage_RC = 'HomePage_RC';

function callback(key) {
  // this returns clicked "Tab" key
  // console.log(key);
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_HomePage_RC, 'constructor');
  }

  render() {
    log(TAG_HomePage_RC, 'render');
    console.log('State: ', this.state);
    console.log('Props: ', this.props);

    const todoColumnsData = this.props.todos;
    const userColumnsData = this.props.users;

    return (
      <div>
        <h2>Todos Users</h2>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Todos" key="1">
            <AddTodo todoColumnsData={todoColumnsData} />
          </TabPane>
          <TabPane tab="Users" key="2">
            <AddUser userColumnsData={userColumnsData} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

/* Map {todos, users} from "reduxState" into HomePage "props" */
const mapStateToProps = (currentState, currentProps) => {
  log(TAG_HomePage_RC, 'mapStateToProps');
  console.log('currentState: ', currentState);
  console.log('currentProps: ', currentProps);

  const { todos, users } = currentState;

  const updatedProps = {
    todos,
    users
  };
  return updatedProps;
};

export default connect(mapStateToProps)(HomePage);
// export default HomePage;
