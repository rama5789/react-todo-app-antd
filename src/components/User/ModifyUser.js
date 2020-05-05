import React from 'react';
import { connect } from 'react-redux';
import { Table, Input, InputNumber, Popconfirm, Divider, Form } from 'antd';

import { log } from '../../shared/logger';
import { usersAction } from '../../store/actions';

// TAGS
const TAG_ModifyUser_RC = 'ModifyUser_RC';
const TAG_EditableCell_RC = undefined; // value: ['ModifyUser_EditableCell_RC']

/* Prepare and Run Test Data */
const usersTestData = [];
/* for (let i = 0; i < 100; i++) {
  usersTestData.push({
    key: i,
    id: i,
    name: `Rama ${i}`,
    email: `rama${i}@abc.com`
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
    log(TAG_ModifyUser_RC, 'constructor');

    // state
    this.state = {
      usersTestData,
      userEditingId: ''
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
        /* render: (text, record) => (
                  <span>
                    <a>Edit</a>
                    <Divider type="vertical" />
                    <a>Delete</a>
                  </span>
                ) */
        render: (text, record) => {
          const { userEditingId } = this.state;
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

  isEditing = (record) => {
    log(undefined, 'isEditing');

    return record.id === this.state.userEditingId;
  };

  edit = (id) => {
    log(TAG_ModifyUser_RC, 'edit');

    this.setState({ userEditingId: id });
  };

  cancel = () => {
    log(TAG_ModifyUser_RC, 'cancel');

    this.setState({ userEditingId: '' });
  };

  save = (form, id) => {
    log(TAG_ModifyUser_RC, 'save');

    form.validateFields((error, row) => {
      if (error) return;

      console.log(`Received User Id to be updated: ${id} : `, row);
      // dispatch editUser action
      this.props.dispatch(usersAction.editUser(id, row));
      this.setState({ userEditingId: '' });
    });
  };

  delete = (id) => {
    log(TAG_ModifyUser_RC, 'delete');

    console.log('Received User Id to be deleted: ', id);
    // dispatch deleteUser action
    this.props.dispatch(usersAction.deleteUser(id));
    this.setState({ userEditingId: '' });
  };

  render() {
    log(TAG_ModifyUser_RC, 'render');

    // table properties
    const components = {
      body: {
        cell: EditableCell // table body cell is editable
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
          dataSource={this.props.userColumnsData}
          /* dataSource={this.state.usersTestData} */
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

const EditableFormTable = Form.create()(EditableTable);

export default connect()(EditableFormTable);
