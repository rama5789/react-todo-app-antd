import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, DatePicker } from 'antd';

import { log } from '../../shared/logger';

import { todosAction } from '../../store/actions';
import ModifyTodo from './ModifyTodo';

// TAGS
const TAG_AddTodo_RC = 'AddTodo_RC';
const TAG_TodoCreateForm_RC = 'AddTodo_TodoCreateForm_RC';

// Add Todo Form
const TodoCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {
    render() {
      log(TAG_TodoCreateForm_RC, 'render');

      // props
      const { visible, onCancel, onCreate, saveBtnloading, form } = this.props;
      // others
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Add New Todo"
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
          {/* Add Todo Form*/}
          <Form layout="vertical">
            {/* "action" input */}
            <Form.Item label="Action">
              {getFieldDecorator('action', {
                rules: [{ required: true, message: 'Please provide Action!' }]
              })(<Input placeholder="Action" />)}
            </Form.Item>
            {/* "dateAdded" input */}
            <Form.Item label="DateAdded">
              {getFieldDecorator('dateAdded', {
                rules: [
                  {
                    type: 'object',
                    required: true,
                    message: 'Please select DateTime!'
                  }
                ]
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_AddTodo_RC, 'constructor');

    // state
    this.state = {
      visible: false,
      saveBtnloading: false
    };
  }

  showModal = () => {
    log(TAG_AddTodo_RC, 'showModal');

    this.setState({ visible: true });
  };

  handleCancel = () => {
    log(TAG_AddTodo_RC, 'handleCancel');

    const { form } = this.formRef.props;

    form.resetFields(); // reset form inputs
    this.setState({ visible: false });
  };

  handleCreate = () => {
    log(TAG_AddTodo_RC, 'handleCreate');

    this.setState({ saveBtnloading: true });

    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received errors from TodoCreateForm: ', err);

        this.setState({ saveBtnloading: false });
        return;
      }

      console.log('Received values from TodoCreateForm: ', values);

      // wait for 3 secs and then dispatch addTodo action
      const createTodoParams = {
        ...values,
        dateAdded: values['dateAdded'].format('YYYY-MM-DD HH:mm:ss')
      };
      setTimeout(() => {
        this.props.dispatch(todosAction.addTodo(createTodoParams));
        form.resetFields(); // reset form inputs

        this.setState({
          visible: false,
          saveBtnloading: false
        });
      }, 3000);
    });
  };

  saveFormRef = (formRef) => {
    log(TAG_AddTodo_RC, 'saveFormRef');

    this.formRef = formRef;
  };

  render() {
    log(TAG_AddTodo_RC, 'render');

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Add Todo
        </Button>
        <ModifyTodo todoColumnsData={this.props.todoColumnsData} />
        <TodoCreateForm
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

export default connect()(AddTodo);
// export default AddTodo;
