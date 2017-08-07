var path = require('path'),
    config = require('./_config');

module.exports = {
    sass: {
        files: path.join(config.paths.sass.root, '**/*.scss'),
        tasks: ['sass:dev', 'postcss:dev']
    },
    svg_symbol: {
        files: path.join(config.paths.img, 'svg-src/symbol/**/*.svg'),
        tasks: ['svg_sprite:symbol']
    },
    svg_css_sprite: {
        files: path.join(config.paths.img, 'svg-src/css-sprite/**/*.svg'),
        tasks: ['svg_sprite:css_sprite']
    }
};
