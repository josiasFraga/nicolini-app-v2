import {createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {reducer as formReducer} from 'redux-form';
import * as reducers from './src/reducers';

// Sagas
import app from './src/reducers/sagas/app';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    form: formReducer,
    ...reducers
  }),
  applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(app);

export default store;
