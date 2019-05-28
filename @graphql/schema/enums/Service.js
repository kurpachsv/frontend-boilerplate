import {GraphQLEnumType} from 'graphql';
import {SERVICE} from 'packages/enum/index';

export default new GraphQLEnumType({
    name: 'SERVICE',
    description: 'Service name',
    values: {
        [SERVICE.landing]: {},
        [SERVICE.admin]: {},
    },
});
