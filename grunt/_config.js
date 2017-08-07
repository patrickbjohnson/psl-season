var path = require('path');
/**
 * Configuration values used by various grunt tasks
 */
module.exports = {
    paths: {
        assets: getAssetPath(),
        css: getAssetPath('css'),
        img: getAssetPath('img'),
        js: getAssetPath('js'),
        sass: {
            root: getAssetPath('scss'),
            main: {
                sass: getAssetPath('scss/main.scss'),
                css: getAssetPath('css/main.css'),
                cssmin: getAssetPath('css/main.min.css')
            }
        }
    },
    /**
     * What browser versions should we support when generating the CSS files.
     * Valid string values can be found here: https://github.com/ai/browserslist
     */
    browserSupport: ['last 2 versions', 'ie 9-11'],
    /**
     * What files should we watch to refresh browser when changed?
     */
    browserSyncWatchFiles: [
        getAssetPath('css/*.css'),
        getAssetPath('img/**/*'),
        '!' + getAssetPath('img/svg-src/**/*'),
        getAssetPath('js/built/*.js'),
        
    ]
};

/**
 * Return the path to our assets directory
 * @returns {string}
 */
function getAssetPath(assetPath) {
    assetPath = assetPath || '';
    return path.join('assets/', assetPath);
}
