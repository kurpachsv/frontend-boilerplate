import {getMessages} from 'packages/intl';

export default (rootValue, {locale, type}) => {
    return getMessages({locale, type});
};
