import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Children, Fragment} from 'react';
import isBrowser from 'packages/utils/isBrowser';
import {userAgentAction} from 'packages/redux';
import {mobileBreakpoint} from 'packages/enum';

const checkMobile = () => isBrowser
    ? window.innerWidth < mobileBreakpoint.thin
    : undefined;

export default class Layout extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        // For storybook usage
        isMobile: PropTypes.bool,
    };
    static defaultProps = {
        isMobile: undefined,
    };
    static contextTypes = {
        store: PropTypes.object,
        intl: PropTypes.object,
    };
    static childContextTypes = {
        userAgent: PropTypes.object,
    };

    /**
     * Puts userAgent in context.
     */
    getChildContext() {
        const {store} = this.context;
        if (store) {
            // normal usage
            return {
                userAgent: store.getState()
                    .getIn(['userAgent'])
                    .toJS(),
            };
        } else {
            // storybook usage
            let {isMobile} = this.props;
            return {
                userAgent: {
                    isMobile: _.isUndefined(isMobile) ? checkMobile() : isMobile,
                },
            };
        }
    }

    constructor(...args) {
        super(...args);
        this.onResize = _.debounce(this.onResize, 200);
        this.state = {error: null};
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize, {passive: true});
        Raven.config('https://bfabeebe69554dafb145ccef88a73dfb@sentry.io/1232851')
            .install();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    componentDidCatch(error, info) {
        this.setState({error});
        // React 16 error handler https://facebook.github.io/react/blog/2017/07/26/error-handling-in-react-16.html
        if (isBrowser) {
            __PRODUCTION__ ? Raven.captureException(error, {extra: info}) : null;
        }
    }

    /**
     * Update `isMobile` in redux after resize
     */
    onResize = () => {
        const {store} = this.context;
        if (store) {
            store.dispatch(userAgentAction({
                isMobile: checkMobile(),
            }));
        }
        this.forceUpdate(); // under storybook
    };

    render() {
        const {intl: {formatMessage}} = this.context;
        if (this.state.error) {
            // render fallback UI
            return (
                <div>
                    <a onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
                        {formatMessage({id: 'error.report'})}
                    </a>
                </div>
            );
        } else {
            // when there's no an error, render children untouched
            return (
                <Fragment>
                    {Children.only(this.props.children)}
                </Fragment>
            );
        }
    }
}
