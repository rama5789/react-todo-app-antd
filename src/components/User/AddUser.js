import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input } from 'antd';

import { log } from '../../shared/logger';

import { usersAction } from '../../store/actions';
import ModifyUser from './ModifyUser';

// TAGS
const TAG_AddUser_RC = 'AddUser_RC';
const TAG_UserCreateForm_RC = 'AddUser_UserCreateForm_RC';

// Add User Form
const UserCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
      log(TAG_UserCreateForm_RC, 'render');

      // props
      const { visible, onCancel, onCreate, saveBtnloading, form } = this.props;
      // others
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Add New User"
          /* Modal Cancel(X) */
          onCancel={onCancel}
          /* Customized Footer Buttons */
          footer={[
            <Button key="back" onClick={onCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={saveBtnloading}
              onClick={onCreate}>
              Save
            </Button>
          ]}>
          {/* Add User Form*/}
          <Form layout="vertical">
            {/* "name" input */}
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please provide Name!' }]
              })(<Input placeholder="Name" />)}
            </Form.Item>
            {/* "email" input */}
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please provide Email!' }]
              })(<Input placeholder="Email" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_AddUser_RC, 'constructor');

    // state
    this.state = {
      visible: false,
      saveBtnloading: false
    };
  }

  showModal = () => {
    log(TAG_AddUser_RC, 'showModal');

    this.setState({ visible: true });
  };

  handleCancel = () => {
    log(TAG_AddUser_RC, 'handleCancel');

    const { form } = this.formRef.props;

    form.resetFields(); // reset form inputs
    this.setState({ visible: false });
  };

  handleCreate = () => {
    log(TAG_AddUser_RC, 'handleCreate');

    this.setState({ saveBtnloading: true });

    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received errors from UserCreateForm: ', err);

        this.setState({ saveBtnloading: false });
        return;
      }

      console.log('Received values from UserCreateForm: ', values);

      // wait for 3 secs and then dispatch addUser action
      const createUserParams = {
        ...values
      };
      setTimeout(() => {
        this.props.dispatch(usersAction.addUser(createUserParams));
        form.resetFields(); // reset form inputs

        this.setState({
          visible: false,
          saveBtnloading: false
        });
      }, 3000);
    });
  };

  saveFormRef = (formRef) => {
    log(TAG_AddUser_RC, 'saveFormRef');

    this.formRef = formRef;
  };

  render() {
    log(TAG_AddUser_RC, 'render');

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add User
        </Button>
        <ModifyUser userColumnsData={this.props.userColumnsData} />
        <UserCreateForm
          visible={this.state.visible}
          saveBtnloading={this.state.saveBtnloading}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          wrappedComponentRef={this.saveFormRef}
        />
      </div>
    );
  }
}

export default connect()(AddUser);
// export default AddUser;
