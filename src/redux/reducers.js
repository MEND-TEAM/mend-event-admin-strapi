import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import reducerApp from './app/reducers';

import history from '../lib/history';

const rootReducer = combineReducers({
    router: connectRouter(history),
    app: reducerApp
});
export default rootReducer;