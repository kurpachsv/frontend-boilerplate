import {fromJS} from 'immutable';
import {createSelector} from 'reselect';
import {handleActions} from 'redux-actions';
import {initialState, UPDATE} from 'react-intl-redux';

export const intlSelector = createSelector(
    (state) => state.getIn(['intl']),
    (intl) => intl.toJS(),
);

export default handleActions({
    // Handle `@@intl/UPDATE` action
    [UPDATE]: (state, {payload}) => {
        return state.merge(payload);
    },
}, fromJS(initialState));
