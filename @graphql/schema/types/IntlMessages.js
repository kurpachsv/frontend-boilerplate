import {GraphQLObjectType, GraphQLString, GraphQLNonNull} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLObjectType({
    name: 'IntlMessages',
    description: 'Translated messages for internalization',
    fields: {
        locale: {
            type: new GraphQLNonNull(GraphQLString),
        },
        messages: {
            type: new GraphQLNonNull(GraphQLJSON),
        },
    },
});
