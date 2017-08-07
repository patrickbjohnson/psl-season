module.exports = function(grunt) {

    require('load-grunt-config')(grunt);

    // load ETR asset generator task
    grunt.loadTasks('grunt/generate/tasks');
};
