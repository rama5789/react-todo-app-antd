import { ADD_USER, EDIT_USER, DELETE_USER } from '../actionTypes';

export const addUser = (params) => ({
  type: ADD_USER,
  payload: {
    params
  }
});

export const editUser = (id, params) => ({
  type: EDIT_USER,
  payload: {
    id,
    params
  }
});

export const deleteUser = (id) => ({
  type: DELETE_USER,
  payload: {
    id
  }
});
