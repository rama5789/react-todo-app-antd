import { combineReducers } from 'redux';
import todos from './todos';
import users from './users';

// combine all reducers
const rootReducer = combineReducers({
  todos,
  users
});

export default rootReducer;
