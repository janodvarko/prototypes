import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers'; // Import your root reducer

const logger = createLogger({
  // Customize options here: collapsed, diff, etc.
});

const middleware = [logger];

// Only use logger in development mode
if (process.env.NODE_ENV === 'production') {
  middleware.length = 0;
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

export default store;
