/* eslint-disable max-len */
import {
    GraphQLObjectType,
    GraphQLSchema,
} from 'graphql';

// Queries
import intlMessages from './queries/common/intlMessages';
import profile from './queries/common/profile';

// Mutations
import login from './mutations/landing/login';

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root Query for GraphQL api',
    fields: () => ({
        profile,
        intlMessages,
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: () => ({
        login,
    }),
});


export default new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
    types: [],
});
