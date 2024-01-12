import { combineReducers } from 'redux';
import exampleReducer from './exampleReducer';

const rootReducer = combineReducers({
  example: exampleReducer,
  // Add other reducers here when you create them
});

export default rootReducer;
