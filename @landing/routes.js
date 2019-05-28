import {URLS} from 'packages/enum';
import Home from './containers/HomeContainer';
import Main from './components/sections/Main';

export default [
    {
        path: URLS.root,
        component: Home,
        routes: [
            {
                path: URLS.root,
                component: Main,
            }
        ],
    },
];

