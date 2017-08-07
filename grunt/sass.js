var config = require('./_config');

module.exports = {
    dev: {
        options: {
            sourceMap: true
        },
        files: [
            {src: config.paths.sass.main.sass, dest: config.paths.sass.main.css}
        ]
    },

    prod: {
        options: {
            outputStyle: 'compressed'
        },
        files: [
            {src: config.paths.sass.main.sass, dest: config.paths.sass.main.cssmin}
        ]
    }
};
