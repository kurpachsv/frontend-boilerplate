const fs = require('fs');
const path = require('path');
const checksum = require('checksum');
const uglifyJS = require('uglify-js');

const cache = {
    link: {},
    inline: {},
};

const getLinked = ({src, defer, production}) => {
    const assetPath = path.join(BUILD_DIR, src);
    let hash = '';

    if (production) {
        try {
            hash = checksum(fs.readFileSync(assetPath, {encoding: 'utf8'}));
        } catch (err) {}

        hash = `?${hash ? hash.substr(0, 8) : Date.now()}`;
    }
    return do {
        if (src.endsWith('.js')) {
            `<script src="${src}${hash}" ${defer ? 'defer' : ''}></script>`;
        } else if (src.endsWith('.css')) {
            `<link rel="stylesheet" media="all" href="${src}${hash}" />`;
        } else if (src.endsWith('.svg')) {
            `<img style="display: none;" src="${src}${hash}" />`;
        } else {
            `<!-- unknown format for ${src} -->`;
        }
    };
};

/**
 * Инлайнит контент файла на страницу
 * @param src
 * @param production
 * @return {*}
 */
const getInlined = ({src, production}) => {
    const assetPath = path.join(BUILD_DIR, src);

    if (!fs.existsSync(assetPath)) {
        return getLinked({src, production});
    }

    let content = fs.readFileSync(assetPath, {encoding: 'utf8'});

    if (src.endsWith('.js') && production) {
        const {code, error} = uglifyJS.minify(content);
        if (error) {
            console.error('ERROR minify ', assetPath);
            console.error(error);
        } else {
            content = code;
        }
    }
    return do {
        if (src.endsWith('.js')) {
            `<script>${content}</script>`;
        } else if (src.endsWith('.css')) {
            `<style>${content}</style>`;
        } else if (src.endsWith('.svg')) {
            content.replace(/<\?xml[^?]+\?>/, '');
        } else {
            `<!-- unknown format for ${src} -->`;
        }
    };
};

/**
 * Подключает js, css, svg. На бою рассчитывает антикеш.
 * @param {string} src Путь на сервере до бандла. Полный путь
 *   вычисляется относительно глобальной переменной `BUILD_DIR`.
 * @param {boolean} [type] Тип подключения: link - ссылка, inlin - вставить контент, none - не подключать.
 * @param {boolean} [defer] Для скриптов асинхронная загрузка, отложенное выполнение.
 * @param {boolean} [production] Признак промышленного выполнения. Для тестирования
 * @param {boolean} [useCache] Использовать кеш. Для тестирования
 * @returns {string}
 */
const asset = ({src, type = 'link', defer, production = __PRODUCTION__, useCache = true}) => {
    if (type === 'none' || !cache[type]) {
        return '';
    } else if (!cache[type][src] || !useCache) {
        if (type === 'inline' && fs.existsSync(path.join(BUILD_DIR, src))) {
            cache[type][src] = getInlined({src, production});
        } else {
            cache[type][src] = getLinked({src, production, defer});
        }
    }
    return cache[type][src];
};

module.exports = asset;
