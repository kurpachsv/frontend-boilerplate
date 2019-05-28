/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class Main extends Component {
    static propTypes = {
        route: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    };

    static contextTypes = {
        userAgent: PropTypes.shape({
            isMobile: PropTypes.bool,
        }),
    };

    render() {
        return (
            <section>
                This is private admin page.
            </section>
        );
    }
}
