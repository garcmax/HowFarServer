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
        script: 'server/server.js',
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
    
     mochaTest: {
       test: {
        options: {
          reporter: 'spec',
          captureFile: 'test/log.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-git-revision');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['nodemon']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('dist', ['mochaTest','revision','compress']);
 };