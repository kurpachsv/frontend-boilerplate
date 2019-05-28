import {GraphQLObjectType, GraphQLBoolean, GraphQLNonNull} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

export default new GraphQLObjectType({
    name: 'MutationResult',
    description: 'Results of applied mutation',
    fields: {
        success: {
            type: new GraphQLNonNull(GraphQLBoolean),
        },
        data: {
            type: GraphQLJSON,
        },
        errors: {
            type: GraphQLJSON,
        },
    },
});
