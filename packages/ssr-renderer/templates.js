const asset = require('./utils/asset');

const {GA_KEY} = require('config/server/config');

/**
 * Формирует статичную часть заголовка, не зависящую от адреса страницы.
 * @param {Boolean} initial Признак первого обращения клиента
 * @returns {string}
 */
export const headStatic = ({type, styleTags, suffix = __PRODUCTION__ ? 'production.min' : 'development'}) => `
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" sizes="57x57" href="/assets/themes/theme-ab/assets/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/assets/themes/theme-ab/assets/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/assets/themes/theme-ab/assets/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/assets/themes/theme-ab/assets/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/assets/themes/theme-ab/assets/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/assets/themes/theme-ab/assets/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/assets/themes/theme-ab/assets/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/themes/theme-ab/assets/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/themes/theme-ab/assets/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/assets/themes/theme-ab/assets/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/themes/theme-ab/assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/assets/themes/theme-ab/assets/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/themes/theme-ab/assets/favicon-16x16.png">
    <link rel="manifest" href="/assets/themes/theme-ab/assets/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/assets/themes/theme-ab/assets/ms-icon-144x144.png">
    
    <script src='https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)'></script>
    <script>var lodash_fp = _.noConflict();</script>   
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.23.0/polyfill.min.js"></script>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en,Intl.~locale.de"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.8.6/umd/react.${suffix}.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.6/umd/react-dom.${suffix}.js"></script>
    <script src="https://cdn.ravenjs.com/3.26.2/raven.min.js" crossorigin="anonymous"></script>

    ${asset({src: '/assets/scripts/vendor.js', defer: true})}
    ${asset({src: `/assets/scripts/${type}.js`, defer: true})}
    ${asset({src: '/assets/themes/theme-ab/theme.css'})}
    ${asset({src: '/assets/styles/vendor.css'})}
    ${asset({src: `/assets/styles/${type}.css`})}
    
    ${styleTags}
`;

/**
 * Формирует метаданные заголовка, зависящие от адреса страницы.
 * @param {Object} meta
 */
export const headMeta = (meta = {}) => `
    <title>${meta.title || ''}</title>
    <meta name="description" content="${meta.description || ''}">
    <meta name="keyword" content="${meta.keyword || ''}">
    <meta property="og:title" content="${meta.title || ''}" />
    <meta property="og:description" content="${meta.description || ''}" />
</head>`;

/**
 * Выводит сообщение об ошибке.
 * @param {Error} err
 */
export const renderError = (err) => `<div>
    ${JSON.stringify({message: err.message, stack: err.stack}, null, 2)}
</div>`;

/**
 * Формирует body.
 */
export const body = ({content, initialState, apolloState, csrfToken, type}) => `
<body>
    <div id="app-root">${content}</div>
    <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};
        window.__APOLLO_STATE__ = ${JSON.stringify(apolloState).replace(/</g, '\\u003c')};
        window.__CSRF_TOKEN__ = '${csrfToken}';
    </script>
    <script src='https://www.googletagmanager.com/gtag/js?id=${GA_KEY}'></script>
    <script>
         if (window.sessionStorage) {
                if (window.sessionStorage.getItem("GA")) {
                    console.log('GA is disabled')
                    const disableGA = 
                    window['ga-disable-' + '${GA_KEY}'] = true;
                }
         }
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${GA_KEY}', { 'anonymize_ip': true });
    </script>    

</body>`;
