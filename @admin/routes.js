import {URLS} from 'packages/enum';

import Home from './components/Home';
import Main from './components/sections/Main';

export default [
    {
        path: URLS.admin,
        component: Home,
        routes: [
            {
                path: URLS.admin,
                component: Main,
            }
        ],
    },
];

