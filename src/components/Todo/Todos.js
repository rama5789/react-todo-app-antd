import React from 'react';
import { connect } from 'react-redux';

import CreateModal from '../Common/CreateModal';
import TableLists from '../Common/TableLists';
import { CreateTodoForm, EditDeleteTodoForm } from './TodoForms';

import { todosAction } from '../../store/actions';

import { log } from '../../shared/logger';

// TAGS
const TAG_Todos = 'Todos_RC';

class Todos extends React.Component {
  constructor(props) {
    super(props);
    log(TAG_Todos, 'constructor');

    // state
    this.state = {
      createTodoModalVisible: false,
      createTodoSaveBtnLoading: false
    };
  }

  /* CreateTodo Methods */
  handleCreateTodoCreate = () => {
    log(TAG_Todos, 'handleCreateTodoCreate');

    this.setState({ createTodoSaveBtnLoading: true });

    const { form } = this.createTodoFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received errors from CreateTodoForm: ', err);

        this.setState({ createTodoSaveBtnLoading: false });
        return;
      }

      console.log('Received values from CreateTodoForm: ', values);

      // wait for 3 secs and then dispatch addTodo action
      const createTodoParams = {
        ...values,
        dateAdded: values['dateAdded'].format('YYYY-MM-DD HH:mm:ss')
      };
      setTimeout(() => {
        this.props.addTodo(createTodoParams);
        form.resetFields(); // reset form inputs

        this.setState({
          createTodoModalVisible: false,
          createTodoSaveBtnLoading: false
        });
      }, 3000);
    });
  };

  /* Other Methods */
  showCreateTodoModal = () => {
    log(TAG_Todos, 'showCreateTodoModal');

    this.setState({ createTodoModalVisible: true });
  };

  handleCreateTodoCancel = () => {
    log(TAG_Todos, 'handleCreateTodoCancel');

    const { form } = this.createTodoFormRef.props;
    form.resetFields(); // reset form inputs

    this.setState({ createTodoModalVisible: false });
  };

  saveCreateTodoFormRef = (formRef) => {
    log(TAG_Todos, 'saveCreateTodoFormRef');

    this.createTodoFormRef = formRef;
  };

  render() {
    log(TAG_Todos, 'render');

    return (
      <div className="Todos">
        <CreateModal
          buttonText="Create Todo"
          setModalVisible={this.showCreateTodoModal}>
          <CreateTodoForm
            visible={this.state.createTodoModalVisible}
            saveBtnloading={this.state.createTodoSaveBtnLoading}
            onCancel={this.handleCreateTodoCancel}
            onCreate={this.handleCreateTodoCreate}
            wrappedComponentRef={this.saveCreateTodoFormRef}
          />
        </CreateModal>
        <TableLists>
          <EditDeleteTodoForm
            data={this.props.todos}
            onEdit={this.props.editTodo}
            onDelete={this.props.deleteTodo}
          />
        </TableLists>
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => {
  const { todos } = reduxState;
  const updatedProps = { todos };
  return updatedProps;
};

const mapDispatchToProps = (dispatch) => {
  const updatedProps = {
    addTodo: (params) => {
      dispatch(todosAction.addTodo(params));
    },
    editTodo: (id, params) => {
      dispatch(todosAction.editTodo(id, params));
    },
    deleteTodo: (id) => {
      dispatch(todosAction.deleteTodo(id));
    }
  };
  return updatedProps;
};

// export default Todos;
export default connect(mapStateToProps, mapDispatchToProps)(Todos);
