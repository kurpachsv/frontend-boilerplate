import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class Find extends Component {
    static contextTypes = {
        intl: PropTypes.object.isRequired,
    };

    render() {
        const {route} = this.props;

        const {intl: {formatMessage}} = this.context;

        return (
            <section>
                This is landing page.
            </section>
        );
    }
}

