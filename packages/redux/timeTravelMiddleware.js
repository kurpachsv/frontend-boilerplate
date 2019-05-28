/**
 * Добавляет поддержку Redux DevTools и обеспечивает Time Travel.
 */
import Immutable from 'immutable';
import {LOCATION_CHANGE} from 'react-router-redux';

export const isTimeTravel = '@@devTools/IS_TIME_TRAVEL';

export const timeTravelStoreListener = (store, history) => {
    let prevLocation;

    return () => {
        const location = store.getState().getIn(['routing', 'locationBeforeTransitions']);

        if (!prevLocation && location || prevLocation && !prevLocation.equals(location)) {
            prevLocation = location;

            if (location && !location.equals(Immutable.fromJS(history.location))) {
                history.push(location.merge({state: isTimeTravel}).toJS());
            }
        }
    };
};

export const timeTravelMiddleware = () => next => action => {
    if (action.type !== LOCATION_CHANGE || action.payload.state !== isTimeTravel) {
        next(action);
    }
};
