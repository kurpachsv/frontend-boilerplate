import MobileDetect from 'mobile-detect';
import {mobileBreakpoint} from 'packages/enum';

// Detect device by UA
const md = new MobileDetect(navigator.userAgent);

export const initialState = {
    ...window.__INITIAL_STATE__,
    userAgent: {
        isMobile: !!md.mobile() || window.innerWidth <= mobileBreakpoint.thin,
        isBot: md.is('bot') || window.location.search.includes('isBot'),
    },
};
export const apolloState = window.__APOLLO_STATE__;

delete window.__INITIAL_STATE__;
delete window.__APOLLO_STATE__;
