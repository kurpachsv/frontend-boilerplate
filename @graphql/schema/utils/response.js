export const makeFailResponse = (errors, args = {}) => {
    console.log('errors', errors);
    return Object.assign({}, {success: false}, {errors}, args);
};

export const makeSuccessResponse = (result, args = {}) => {
    return Object.assign({}, {success: true}, result, args);
};
