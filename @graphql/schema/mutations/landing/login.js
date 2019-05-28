import {GraphQLNonNull, GraphQLString} from 'graphql';
import MutationResult from '@graphql/schema/types/MutationResult';
import loginResolver from '@graphql/schema/resolvers/landing/login';

export default {
    type: MutationResult,
    description: 'Login user',
    args: {
        login: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
    },
    resolve: loginResolver,
};
