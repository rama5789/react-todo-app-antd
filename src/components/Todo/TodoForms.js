import React from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Table,
  Popconfirm,
  Divider
} from 'antd';
import moment from 'moment';

import { log } from '../../shared/logger';

// TAGS
const TAG_TodoEditableCell = undefined; // tag = TodoForms_TodoEditableCell_RC
const TAG_CreateTodo = 'TodoForms_CreateTodo_RC';
const TAG_EditDeleteTodo = 'TodoForms_EditDeleteTodo_RC';

const momentFormat = 'YYYY-MM-DD HH:mm:ss';

const EditableContext = React.createContext();

/* Create Todo Form */
class CreateTodo extends React.Component {
  render() {
    log(TAG_CreateTodo, 'render');

    const { visible, onCancel, onCreate, saveBtnloading, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className="CreateTodo">
        <Modal
          visible={visible}
          title="Create New Todo"
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
              })(<DatePicker showTime format={momentFormat} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

/* Edit/Delete Todo Form */
class TodoEditableCell extends React.Component {
  getInput = () => {
    log(TAG_TodoEditableCell, 'getInput');

    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  // validate and return cell value
  renderCell = ({ getFieldDecorator }) => {
    log(TAG_TodoEditableCell, 'renderCell');

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
      if (dataIndex === 'dateAdded') {
        formItem = (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator('dateAdded', {
              rules: [
                {
                  type: 'object',
                  required: true,
                  message: 'Please select DateTime!'
                }
              ],
              initialValue: moment(record[dataIndex], momentFormat)
            })(<DatePicker showTime format={momentFormat} />)}
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
    log(TAG_TodoEditableCell, 'render');

    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditDeleteTodo extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_EditDeleteTodo, 'constructor');

    // state
    this.state = {
      todoEditingId: '',
      editTodoSaveBtnLoading: false
    };

    // Todo Columns
    this.todoColumns = [
      {
        title: 'Action',
        dataIndex: 'action',
        editable: true
      },
      {
        title: 'DateAdded',
        dataIndex: 'dateAdded',
        editable: true
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { todoEditingId } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form) => (
                  <Button
                    key="submit"
                    type="primary"
                    loading={this.state.editTodoSaveBtnLoading}
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
                disabled={todoEditingId !== ''}
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

  /* EditTodo Methods */
  isEditing = (record) => {
    log(undefined, 'isEditing');

    return record.id === this.state.todoEditingId;
  };

  edit = (id) => {
    log(TAG_EditDeleteTodo, 'edit');

    this.setState({ todoEditingId: id });
  };

  save = (form, id) => {
    log(TAG_EditDeleteTodo, 'save');

    this.setState({ editTodoSaveBtnLoading: true });

    form.validateFields((err, row) => {
      if (err) {
        console.log('Received errors: ', err);

        this.setState({
          todoEditingId: '',
          editTodoSaveBtnLoading: false
        });
        return;
      }

      // wait for 3 secs and then dispatch editTodo action
      console.log(`Received TodoId${id} to be updated: `, row);
      const editTodoParams = {
        ...row,
        dateAdded: row['dateAdded'].format(momentFormat)
      };
      setTimeout(() => {
        this.props.onEdit(id, editTodoParams);

        this.setState({
          todoEditingId: '',
          editTodoSaveBtnLoading: false
        });
      }, 3000);
    });
  };

  /* DeleteTodo Methods */
  delete = (id) => {
    log(TAG_EditDeleteTodo, 'delete');

    console.log('Received Todo Id to be deleted: ', id);
    // delete todo
    this.props.onDelete(id);

    this.setState({ todoEditingId: '' });
  };

  /* Other Methods */
  cancel = () => {
    log(TAG_EditDeleteTodo, 'cancel');

    this.setState({ todoEditingId: '' });
  };

  render() {
    log(TAG_EditDeleteTodo, 'render');

    // table properties
    const components = {
      body: {
        cell: TodoEditableCell // table body cell is editable
      }
    };

    // column type validation
    const todoColumns = this.todoColumns.map((col) => {
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
          columns={todoColumns}
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
export const CreateTodoForm = Form.create({ name: 'form_in_modal' })(
  CreateTodo
);
export const EditDeleteTodoForm = Form.create()(EditDeleteTodo);
