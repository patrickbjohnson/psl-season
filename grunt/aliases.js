module.exports = {
    default: {
        description: 'Starts watching Sass/JS files for changes and opens site with BrowserSync watching to reload page.',
        tasks: [
            'webpack:dev',
            'svg_sprite',
            'sass:dev',
            'postcss:dev',
            'browserSync:dev',
            'watch'
        ]
    },
    prod: [
        'webpack:prod',
        'svg_sprite',
        'sass:prod',
        'postcss:prod'
    ]
};
