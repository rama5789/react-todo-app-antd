import React from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Table,
  Popconfirm,
  Divider
} from 'antd';

import CreatePopupForm from '../Common/CreatePopupForm';

import { FORM_TYPE } from '../../shared/constants';
import { log } from '../../shared/logger';

// TAGS
const TAG_UserEditableCell = undefined; // tag = UserForms_UserEditableCell_RC
const TAG_CreateUser = 'UserForms_CreateUser_RC';
const TAG_EditDeleteUser = 'UserForms_EditDeleteUser_RC';

const EditableContext = React.createContext();

/* Create User Form */
class CreateUser extends React.Component {
  render() {
    log(TAG_CreateUser, 'render');

    const { visible, onCancel, onCreate, saveBtnloading, form } = this.props;

    return (
      <div className="CreateUser">
        <CreatePopupForm
          title="Create New User"
          visible={visible}
          onCancel={onCancel}
          onCreate={onCreate}
          saveBtnloading={saveBtnloading}
          form={form}
          popupformType={FORM_TYPE.users.create}
        />
      </div>
    );
  }
}

/* Edit/Delete User Form */
class UserEditableCell extends React.Component {
  getInput = () => {
    log(TAG_UserEditableCell, 'getInput');

    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  // validate and return cell value
  renderCell = ({ getFieldDecorator }) => {
    log(TAG_UserEditableCell, 'renderCell');

    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;

    let formItem;
    if (editing) {
      if (dataIndex === 'email') {
        formItem = (
          <Form.Item style={{ margin: 0 }}>
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
              ],
              initialValue: record[dataIndex]
            })(<Input placeholder="Email" />)}
          </Form.Item>
        );
      } else {
        formItem = (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        );
      }
    } else {
      formItem = children;
    }

    return <td {...restProps}>{formItem}</td>;
  };

  render() {
    log(TAG_UserEditableCell, 'render');

    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditDeleteUser extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_EditDeleteUser, 'constructor');

    // state
    this.state = {
      userEditingId: '',
      editUserSaveBtnLoading: false
    };

    // User Columns
    this.userColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: true
      },
      {
        title: 'Email',
        dataIndex: 'email',
        editable: true
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { userEditingId } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form) => (
                  <Button
                    key="submit"
                    type="primary"
                    loading={this.state.editUserSaveBtnLoading}
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}>
                    Save
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.id)}>
                <Button style={{ marginRight: 8 }}>Cancel</Button>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <a
                disabled={userEditingId !== ''}
                onClick={() => this.edit(record.id)}>
                Edit
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.delete(record.id)}>
                <a>Delete</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
  }

  /* EditUser Methods */
  isEditing = (record) => {
    log(undefined, 'isEditing');

    return record.id === this.state.userEditingId;
  };

  edit = (id) => {
    log(TAG_EditDeleteUser, 'edit');

    this.setState({ userEditingId: id });
  };

  save = (form, id) => {
    log(TAG_EditDeleteUser, 'save');

    this.setState({ editUserSaveBtnLoading: true });

    form.validateFields((err, row) => {
      if (err) {
        console.log('Received errors: ', err);

        this.setState({
          userEditingId: '',
          editUserSaveBtnLoading: false
        });
        return;
      }

      // wait for 3 secs and then dispatch editUser action
      console.log(`Received UserId${id} to be updated: `, row);
      const editUserParams = {
        ...row
      };
      setTimeout(() => {
        this.props.onEdit(id, editUserParams);

        this.setState({
          userEditingId: '',
          editUserSaveBtnLoading: false
        });
      }, 3000);
    });
  };

  /* DeleteUser Methods */
  delete = (id) => {
    log(TAG_EditDeleteUser, 'delete');

    console.log('Received User Id to be deleted: ', id);
    // delete user
    this.props.onDelete(id);

    this.setState({ userEditingId: '' });
  };

  /* Other Methods */
  cancel = () => {
    log(TAG_EditDeleteUser, 'cancel');

    this.setState({ userEditingId: '' });
  };

  render() {
    log(TAG_EditDeleteUser, 'render');

    // table properties
    const components = {
      body: {
        cell: UserEditableCell // table body cell is editable
      }
    };

    // column type validation
    const userColumns = this.userColumns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === ('key' || 'id') ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.props.data}
          columns={userColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel
          }}
        />
      </EditableContext.Provider>
    );
  }
}

// export all forms
export const CreateUserForm = Form.create({ name: 'form_in_modal' })(
  CreateUser
);
export const EditDeleteUserForm = Form.create()(EditDeleteUser);
