// Gruntfile.js
module.exports = function(grunt) {

  grunt.initConfig({

     // watch our node server for changes
    nodemon: {
      dev: {
        script: 'server.js',
      }
    },

  });

  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['nodemon']);
 };