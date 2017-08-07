var config = require('./_config');

module.exports = {
    options: {
        map: true,
        processors: [
            require('autoprefixer')({
                browsers: config.browserSupport
            })
        ]
    },
    dev: {
        src: config.paths.sass.main.css
    },
    prod: {
        options: {
            map: false
        },
        src: config.paths.sass.main.cssmin
    }
};
