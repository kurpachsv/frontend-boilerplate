/** Reducer to use react-router-redux with Immutable
 * https://github.com/gajus/redux-immutable#using-with-react-router-redux
 * https://github.com/reactjs/react-router-redux#what-if-i-use-immutablejs-or-another-state-wrapper-with-my-redux-store
 */
import {fromJS} from 'immutable';
import {handleActions} from 'redux-actions';
import {LOCATION_CHANGE} from 'react-router-redux';

export default handleActions({
    [LOCATION_CHANGE]: (state, {payload}) => {
        gtag('event', 'page_view', {page_path: payload.pathname});
        return state.merge({
            locationBeforeTransitions: payload,
        });
    },
}, fromJS({locationBeforeTransitions: null}));
