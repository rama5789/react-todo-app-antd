import { ADD_USER, EDIT_USER, DELETE_USER } from '../actionTypes';
import { sampleUsersData } from '../sampleData';

/* initial "users" state */
// const initialState = [];
const initialState = sampleUsersData;

const addUser = (currentState, action) => {
  const { params } = action.payload;
  let nextUserId = 0;

  if (currentState.length) {
    const lastUserId = currentState[currentState.length - 1].id;
    nextUserId = lastUserId + 1;
  }
  const newUser = {
    ...params,
    id: nextUserId,
    key: nextUserId
  };
  const updatedState = [...currentState, newUser];
  return updatedState;
};

const editUser = (currentState, action) => {
  const { id, params } = action.payload;

  const updatedState = currentState.map((user) => {
    if (user.id === id) {
      const updatedUser = {
        ...user,
        ...params
      };
      return updatedUser;
    } else {
      return user;
    }
  });
  return updatedState;
};

const deleteUser = (currentState, action) => {
  const { id } = action.payload;

  const updatedState = currentState.filter((user) => user.id !== id);
  return updatedState;
};

/* Reducer */
const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return addUser(state, action);
    case EDIT_USER:
      return editUser(state, action);
    case DELETE_USER:
      return deleteUser(state, action);
    default:
      return state;
  }
};

export default usersReducer;
