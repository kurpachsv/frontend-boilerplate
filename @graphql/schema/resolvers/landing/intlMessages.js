import {getMessages} from 'packages/intl';

export default (obj, {locale, type}) => {
    return getMessages({locale, type});
};
