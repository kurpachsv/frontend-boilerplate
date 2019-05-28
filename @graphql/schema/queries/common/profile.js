import profileResolver from '@graphql/schema/resolvers/common/profile';
import MutationResult from '@graphql/schema/types/MutationResult';

export default {
    type: MutationResult,
    description: 'Return users short info',
    args: {},
    resolve: profileResolver,
};
