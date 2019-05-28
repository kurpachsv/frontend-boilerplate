import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router';
import {renderRoutes} from 'react-router-config';

@withRouter
export default class Home extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
    };

    static contextTypes = {
        intl: PropTypes.object.isRequired,
    };

    render() {
        const {intl: {formatMessage}} = this.context;
        const {route} = this.props;
        return (
            <Fragment>
                {renderRoutes(route.routes)}
            </Fragment>
        );
    }
}
