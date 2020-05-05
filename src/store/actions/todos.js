import { ADD_TODO, EDIT_TODO, DELETE_TODO } from '../actionTypes';

export const addTodo = (params) => ({
  type: ADD_TODO,
  payload: {
    params
  }
});

export const editTodo = (id, params) => ({
  type: EDIT_TODO,
  payload: {
    id,
    params
  }
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: {
    id
  }
});
