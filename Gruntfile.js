// Gruntfile.js
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //get the current git revision
     revision: {

     },

    // watch our node server for changes
    nodemon: {
      dev: {
        script: 'server.js',
      }
    },

    //compress all the files needed to run
    compress: {
      main : {
        options: {
            archive: "dist/<%= pkg.name %>-<%= grunt.config.get('meta.revision') %>.zip"
        },
        files: [{src: ['node_modules/**', 'app/**', 'config/**', '*.js'], dest: 'dist'}]
      }
    },
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-git-revision');

  grunt.registerTask('default', ['nodemon']);
  grunt.registerTask('dist', ['revision','compress']);
 };