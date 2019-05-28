export const checkLocale = ({siteLocale}) => {
    const locales = ['en', 'de'];
    return locales[siteLocale] ? siteLocale : 'en';
};
