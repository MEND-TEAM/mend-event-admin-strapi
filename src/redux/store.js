import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';

import rootReducer from './reducers';
import history from '../lib/history';
import { stateLogger } from '../lib/stateLogger';
import storeApp from './app/store';

const configureStore = (initialState = {}) => {

    initialState.app = {
        ...storeApp        
    };

    const middleWares = [];
    if (process.env.NODE_ENV == 'development') {
        middleWares.push(stateLogger);
    }

    middleWares.push(routerMiddleware(history));    

    const enhancer = compose(
        applyMiddleware(...middleWares),
    );

    const store = createStore(rootReducer, initialState, enhancer)
    return store;
}

export default configureStore;


