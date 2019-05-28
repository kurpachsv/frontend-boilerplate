import React from 'react';
import {renderRoutes} from 'react-router-config';

import {Layout} from 'packages/components';
import routes from '../routes';

export default (props) => (
    <Layout {...props}>
        {renderRoutes(routes)}
    </Layout>
);
