import {combineReducers} from 'redux-immutable';
import intlReducer from 'packages/intl/redux';
import {routingReducer, userAgentReducer} from 'packages/redux';

export default combineReducers({
    intl: intlReducer,
    routing: routingReducer,
    userAgent: userAgentReducer,
});
