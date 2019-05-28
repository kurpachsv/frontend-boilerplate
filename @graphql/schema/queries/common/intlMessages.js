import ServiceEnum from '@graphql/schema/enums/Service';
import LocaleEnum from '@graphql/schema/enums/Locale';
import IntlMessagesType from '@graphql/schema/types/IntlMessages';
import intlMessagesResolver from '@graphql/schema/resolvers/landing/intlMessages';

export default {
    type: IntlMessagesType,
    description: 'Returns translated messages for internalization',
    args: {
        locale: { type: LocaleEnum },
        type: { type: ServiceEnum },
    },
    resolve: intlMessagesResolver,
};
