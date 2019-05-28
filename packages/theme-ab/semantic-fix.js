// Fix semantic-ui-less package, see https://www.artembutusov.com/webpack-semantic-ui/
const fs = require('fs');

const semanticPath = 'node_modules/semantic-ui-less';

// relocate default config
fs.writeFileSync(
    `${semanticPath}/theme.config`,
    "@import '../../semantic/theme.config';\n",
    'utf8'
);

// fix well known bug with default distribution
fixFontPath(`${semanticPath}/themes/default/globals/site.variables`);
fixFontPath(`${semanticPath}/themes/flat/globals/site.variables`);
fixFontPath(`${semanticPath}/themes/material/globals/site.variables`);

function fixFontPath(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const newContent = content.replace(
        "@fontPath  : '../../themes/",
        "@fontPath  : '../../../themes/"
    );
    fs.writeFileSync(filename, newContent, 'utf8');
}
