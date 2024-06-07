import thunkMiddleware from 'redux-thunk';
//import createLogger from 'redux-logger';
import {compose, createStore, applyMiddleware} from 'redux';
import {rootReducer} from '../reducers';

//const loggerMiddleware = createLogger();


export let store = createStore(rootReducer, {},
  // applyMiddleware(  //for asynchronous actions
  //   thunkMiddleware, // lets us dispatch() functions
  //   loggerMiddleware // neat middleware that logs actions
  // ),
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
);
