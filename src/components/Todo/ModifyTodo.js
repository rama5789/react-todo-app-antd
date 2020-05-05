import React from 'react';
import { connect } from 'react-redux';
import { Table, Input, InputNumber, Popconfirm, Divider, Form } from 'antd';

import { log } from '../../shared/logger';
import { todosAction } from '../../store/actions';

// TAGS
const TAG_ModifyTodo_RC = 'ModifyTodo_RC';
const TAG_EditableCell_RC = undefined; // value: ['ModifyTodo_EditableCell_RC']

/* Prepare and Run Test Data */
const todosTestData = [];
/* for (let i = 0; i < 100; i++) {
  todosTestData.push({
    key: i,
    id: i,
    action: `Laundry ${i}`,
    dateAdded: '2025-05-10 11:00:00',
  });
} */

const EditableContext = React.createContext();

/* Editable Cell to modify "Cell" data */
class EditableCell extends React.Component {
  getInput = () => {
    log(TAG_EditableCell_RC, 'getInput');

    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  // validate and return cell value
  renderCell = ({ getFieldDecorator }) => {
    log(TAG_EditableCell_RC, 'renderCell');

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

    return (
      <td {...restProps}>
        {editing ? (
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
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    log(TAG_EditableCell_RC, 'render');

    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

/* Editable Table to save "Table" data */
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_ModifyTodo_RC, 'constructor');

    // state
    this.state = {
      todosTestData,
      todoEditingId: ''
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
        /* render: (text, record) => (
          <span>
            <a>Edit</a>
            <Divider type="vertical" />
            <a>Delete</a>
          </span>
        ) */
        render: (text, record) => {
          const { todoEditingId } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form) => (
                  <a
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}>
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.id)}>
                <a>Cancel</a>
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

  isEditing = (record) => {
    log(undefined, 'isEditing');

    return record.id === this.state.todoEditingId;
  };

  edit = (id) => {
    log(TAG_ModifyTodo_RC, 'edit');

    this.setState({ todoEditingId: id });
  };

  cancel = () => {
    log(TAG_ModifyTodo_RC, 'cancel');

    this.setState({ todoEditingId: '' });
  };

  save = (form, id) => {
    log(TAG_ModifyTodo_RC, 'save');

    form.validateFields((error, row) => {
      if (error) return;

      console.log(`Received Todo Id to be updated: ${id} : `, row);
      // dispatch editTodo action
      this.props.dispatch(todosAction.editTodo(id, row));
      this.setState({ todoEditingId: '' });
    });
  };

  delete = (id) => {
    log(TAG_ModifyTodo_RC, 'delete');

    console.log('Received Todo Id to be deleted: ', id);
    // dispatch deleteTodo action
    this.props.dispatch(todosAction.deleteTodo(id));
    this.setState({ todoEditingId: '' });
  };

  render() {
    log(TAG_ModifyTodo_RC, 'render');

    // table properties
    const components = {
      body: {
        cell: EditableCell // table body cell is editable
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
          dataSource={this.props.todoColumnsData}
          /* dataSource={this.state.todosTestData} */
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

const EditableFormTable = Form.create()(EditableTable);

export default connect()(EditableFormTable);
