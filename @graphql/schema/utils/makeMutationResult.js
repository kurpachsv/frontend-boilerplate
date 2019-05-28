import _ from 'lodash';
import invariant from 'invariant';

export default ({success, errors = {}, error = '', data = null}) => {
    invariant(
        _.isBoolean(success) || _.isUndefined(success),
        'Expected "success" provided as an argument to getMutationResult ' +
        'to be a boolean. Instead, received %s.',
        success,
    );
    invariant(
        _.isPlainObject(errors),
        'Expected "errors" provided as an argument to getMutationResult ' +
        'to be an object. Instead, received %s.',
        errors,
    );
    invariant(
        _.isString(error),
        'Expected "errorText" provided as an argument to getMutationResult ' +
        'to be a string. Instead, received %s.',
        error,
    );
    if (error) {
        errors = {
            ...errors,
            _error: error,
        };
    }
    if (_.isUndefined(success)) {
        success = _.isEmpty(errors);
    }
    return {
        success,
        errors: _.isEmpty(errors) ? null : errors,
        data,
    };
};
