import React from 'react';
import { Button, Modal, Form, Input, DatePicker } from 'antd';

import { FORM_TYPE } from '../../shared/constants';
import { log } from '../../shared/logger';

// TAGS
const TAG_CreatePopupForm = 'CreatePopupForm_FC';

const momentFormat = 'YYYY-MM-DD HH:mm:ss';

function CreatePopupForm(props) {
  log(TAG_CreatePopupForm);

  const {
    title,
    visible,
    onCancel,
    onCreate,
    saveBtnloading,
    form,
    popupformType
  } = props;
  const { getFieldDecorator } = form;

  return (
    <div className="CreatePopupForm">
      <Modal
        visible={visible}
        title={title}
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
        {/* Create Todo Form*/}
        {popupformType === FORM_TYPE.todos.create && (
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
              })(<DatePicker showTime format={momentFormat} />)}
            </Form.Item>
          </Form>
        )}
        {/* Create User Form*/}
        {popupformType === FORM_TYPE.users.create && (
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
                rules: [
                  {
                    required: true,
                    message: 'Please provide Email!'
                  },
                  {
                    type: 'email',
                    message: 'The input is not a valid E-mail!'
                  }
                ]
              })(<Input placeholder="Email" />)}
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default CreatePopupForm;
