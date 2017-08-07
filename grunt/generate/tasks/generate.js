var fs = require('fs'),
    inquirer = require('inquirer'),
    config = require('../config');

function sanitizeFileName(fileName) {
    return fileName.replace(/\s/g, '-').toLowerCase();
}

var prompts = {
    module: {
        prompts: [
            {
                name: 'fileName',
                message: 'What is the name of your module?'
            },
            {
                name: 'withJs',
                message: 'Create JS file as well?',
                type: 'confirm',
                default: false
            }
        ],
        callback: function(answers, grunt) {
            var fileName = sanitizeFileName(answers.fileName);

            var moduleContents = grunt.template.process(
                fs.readFileSync(config.sass.moduleTmplFile, 'utf8'),
                {data: {moduleName: fileName}}
            );

            var moduleFileName = grunt.template.process(config.sass.fileNameTmpl, {data: {name: fileName}});

            // create the sass module file
            grunt.file.write(config.sass.modulesDir + '/' + moduleFileName, moduleContents);
            // append the import to the __modules.scss file
            fs.appendFileSync(config.sass.modulesFile, '\n@import \'' + fileName + '\';');

            grunt.log.writeln('Created module file ' + config.sass.modulesDir + '/' + moduleFileName);

            if (answers.withJs) {
                var jsFilePath = config.js.modulesDir + '/' + fileName + '.js';
                grunt.file.write(jsFilePath, '');
                grunt.log.writeln('Created js file ' + jsFilePath);
            }
        }
    },

    page: {
        prompts: [
            {
                name: 'fileName',
                message: 'What is the name of your page?'
            },
            {
                name: 'withJs',
                message: 'Create JS file as well?',
                type: 'confirm'
            }
        ],
        callback: function(answers, grunt) {
            var fileName = sanitizeFileName(answers.fileName),
                pageFileName = grunt.template.process(config.sass.fileNameTmpl, {data: {name: fileName}});

            // create the page sass file
            grunt.file.write(config.sass.pagesDir + '/' + pageFileName);
            // append the import to the __pages.scss file
            fs.appendFileSync(config.sass.pagesFile, '\n@import \'' + fileName + '\';');

            grunt.log.writeln('Created page file ' + config.sass.pagesDir + '/' + pageFileName);

             if (answers.withJs) {
                var jsFilePath = config.js.pagesDir + '/' + fileName + '.js';
                grunt.file.write(jsFilePath, '');
                grunt.log.writeln('Created js file ' + jsFilePath);
            }
        }
    },

    layout: {
        prompts: [
            {
                name: 'fileName',
                message: 'What is the name of your layout?'
            }
        ],
        callback: function(answers, grunt) {
            var fileName = sanitizeFileName(answers.fileName),
                layoutFileName = grunt.template.process(config.sass.fileNameTmpl, {data: {name: fileName}});

            // create the layout sass file
            grunt.file.write(config.sass.layoutsDir + '/' + layoutFileName);
            // append the import to the __layouts.scss file
            fs.appendFileSync(config.sass.layoutsFile, '\n@import \'' + fileName + '\';');

            grunt.log.writeln('Created layout file ' + config.sass.layoutsDir + '/' + layoutFileName);
        }
    }
};

module.exports = function(grunt) {
    grunt.registerTask('generate', function(type) {
        var done = this.async();

        if (!prompts[type]) {
            grunt.log.error(type + ' is not a valid generator type.');
            done();
            return;
        }

        inquirer.prompt(prompts[type].prompts, function(answers) {
            prompts[type].callback(answers, grunt);
            done();
        });
    });
};
