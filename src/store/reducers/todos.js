import { ADD_TODO, EDIT_TODO, DELETE_TODO } from '../actionTypes';
import { sampleTodosData } from '../sampleData';

/* initial "todos" state */
// const initialState = [];
const initialState = sampleTodosData;

const addTodo = (currentState, action) => {
  const { params } = action.payload;
  let nextTodoId = 0;

  if (currentState.length) {
    const lastTodoId = currentState[currentState.length - 1].id;
    nextTodoId = lastTodoId + 1;
  }
  const newTodo = {
    ...params,
    id: nextTodoId,
    key: nextTodoId
  };
  const updatedState = [...currentState, newTodo];
  return updatedState;
};

const editTodo = (currentState, action) => {
  const { id, params } = action.payload;

  const updatedState = currentState.map((todo) => {
    if (todo.id === id) {
      const updatedTodo = {
        ...todo,
        ...params
      };
      return updatedTodo;
    } else {
      return todo;
    }
  });
  return updatedState;
};

const deleteTodo = (currentState, action) => {
  const { id } = action.payload;

  const updatedState = currentState.filter((todo) => todo.id !== id);
  return updatedState;
};

/* Reducer */
const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(state, action);
    case EDIT_TODO:
      return editTodo(state, action);
    case DELETE_TODO:
      return deleteTodo(state, action);
    default:
      return state;
  }
};

export default todosReducer;
