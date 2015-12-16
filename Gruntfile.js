// Gruntfile.js
module.exports = function (grunt) {

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
      main: {
        options: {
          archive: "dist/<%= pkg.name %>-<%= grunt.config.get('meta.revision') %>.zip"
        },
        files: [{ src: ['node_modules/**', 'app/**', 'config/**', '*.js'], dest: 'dist' }]
      }
    },

    mochaTest: {     
      testLogReg: {
        src: ['test/LoginAndRegisterSpec.js']
      },
      testUser: {
        src: ['test/UserSpec.js']
      },
      testFriends: {
        src: ['test/FriendsSpec.js']
      },
      testLocation: {
        src: ['test/LocationSpec.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-git-revision');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['nodemon']);
  grunt.registerTask('test', ['mochaTest:testLogReg', 'mochaTest:testUser','mochaTest:testFriends', 'mochaTest:testLocation']);
  grunt.registerTask('testLogReg', ['mochaTest:testLogReg']);
  grunt.registerTask('testUser', ['mochaTest:testUser']);
  grunt.registerTask('testFriends', ['mochaTest:testFriends']);
  grunt.registerTask('testLocation', ['mochaTest:testLocation']);
  grunt.registerTask('dist', ['mochaTest', 'revision', 'compress']);
};