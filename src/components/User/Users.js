import React from 'react';
import { connect } from 'react-redux';

import CreateModal from '../Common/CreateModal';
import TableLists from '../Common/TableLists';
import { CreateUserForm, EditDeleteUserForm } from './UserForms';

import { usersAction } from '../../store/actions';

import { log } from '../../shared/logger';

// TAGS
const TAG_Users = 'Users_RC';

class Users extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_Users, 'constructor');

    // state
    this.state = {
      createUserModalVisible: false,
      createUserSaveBtnLoading: false
    };
  }

  /* CreateUser Methods */
  handleCreateUserCreate = () => {
    log(TAG_Users, 'handleCreateUserCreate');

    this.setState({ createUserSaveBtnLoading: true });

    const { form } = this.createUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received errors from CreateUserForm: ', err);

        this.setState({ createUserSaveBtnLoading: false });
        return;
      }

      console.log('Received values from CreateUserForm: ', values);

      // wait for 3 secs and then dispatch addUser action
      const createUserParams = {
        ...values
      };
      setTimeout(() => {
        this.props.addUser(createUserParams);
        form.resetFields(); // reset form inputs

        this.setState({
          createUserModalVisible: false,
          createUserSaveBtnLoading: false
        });
      }, 3000);
    });
  };

  /* Other Methods */
  showCreateUserModal = () => {
    log(TAG_Users, 'showCreateUserModal');

    this.setState({ createUserModalVisible: true });
  };

  handleCreateUserCancel = () => {
    log(TAG_Users, 'handleCreateUserCancel');

    const { form } = this.createUserFormRef.props;
    form.resetFields(); // reset form inputs

    this.setState({ createUserModalVisible: false });
  };

  saveCreateUserFormRef = (formRef) => {
    log(TAG_Users, 'saveCreateUserFormRef');

    this.createUserFormRef = formRef;
  };

  render() {
    log(TAG_Users, 'render');

    return (
      <div className="Users">
        <CreateModal
          buttonText="Create User"
          setModalVisible={this.showCreateUserModal}>
          <CreateUserForm
            visible={this.state.createUserModalVisible}
            saveBtnloading={this.state.createUserSaveBtnLoading}
            onCancel={this.handleCreateUserCancel}
            onCreate={this.handleCreateUserCreate}
            wrappedComponentRef={this.saveCreateUserFormRef}
          />
        </CreateModal>
        <TableLists>
          <EditDeleteUserForm
            data={this.props.users}
            onEdit={this.props.editUser}
            onDelete={this.props.deleteUser}
          />
        </TableLists>
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => {
  const { users } = reduxState;
  const updatedProps = { users };
  return updatedProps;
};

const mapDispatchToProps = (dispatch) => {
  const updatedProps = {
    addUser: (params) => {
      dispatch(usersAction.addUser(params));
    },
    editUser: (id, params) => {
      dispatch(usersAction.editUser(id, params));
    },
    deleteUser: (id) => {
      dispatch(usersAction.deleteUser(id));
    }
  };
  return updatedProps;
};

// export default Users;
export default connect(mapStateToProps, mapDispatchToProps)(Users);
