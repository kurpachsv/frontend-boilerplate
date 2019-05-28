import {GraphQLEnumType} from 'graphql';

export default new GraphQLEnumType({
    name: 'LOCALE',
    description: 'Locale for internalization',
    values: {
        de: {},
        en: {},
    },
});
