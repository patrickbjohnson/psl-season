var config = {};
config.sass = {};
config.sass.sassDir = './assets/scss'

config.sass.modulesDir = config.sass.sassDir + '/modules';
config.sass.modulesFile = config.sass.modulesDir + '/__modules.scss';

config.sass.pagesDir = config.sass.sassDir + '/pages';
config.sass.pagesFile = config.sass.pagesDir + '/__pages.scss';

config.sass.layoutsDir = config.sass.sassDir + '/layouts';
config.sass.layoutsFile = config.sass.layoutsDir + '/__layouts.scss';

config.sass.fileNameTmpl = '_<%= name %>.scss';
config.sass.moduleTmplFile = __dirname + '/templates/sass-module.tmpl';

config.js = {};
config.js.srcDir = './assets/js/src';
config.js.modulesDir = config.js.srcDir + '/modules';
config.js.pagesDir = config.js.srcDir + '/pages';

module.exports = config;
