import {Map} from 'immutable';
import {createAction, handleActions} from 'redux-actions';

export const userAgentAction = createAction('isMobile/UPDATE');

export default handleActions({
    /**
     * Updates {userAgent: {isMobile}} key
     */
    [userAgentAction]: (state, {payload}) => {
        return state.merge(payload);
    },
}, new Map());
