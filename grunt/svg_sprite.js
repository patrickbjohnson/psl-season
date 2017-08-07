var path = require('path'),
    config = require('./_config');

module.exports = {
    css_sprite: {
        expand: true,
        cwd: path.join(config.paths.img, 'svg-src/css-sprite'),
        src: ['**/*.svg'],
        dest: config.paths.assets,
        options: {
            mode: {
                css: {
                    bust: false,
                    render: {
                        scss: {
                            dest: path.join(process.cwd(), config.paths.sass.root, 'base/_sprite.scss')
                        }
                    },
                    dimensions: true,
                    prefix: '%%'
                }
            }
        }
    },

    symbol: {
        expand: true,
        cwd: path.join(config.paths.img, 'svg-src/symbol'),
        src: ['**/*.svg'],
        dest: process.cwd(),
        options: {
            mode: {
                symbol: {
                    dest: config.paths.img,
                    sprite: 'symbols.svg',
                }
            }
        }
    }
};
