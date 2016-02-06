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
        files: [
            { src: ['app/**'], dest: '.'},
            { src: ['config/**'], dest: '.'},
            { src: ['server/**'], dest: '.'},
            { src: ['node_modules/**'], dest: '.'},
            { src: ['Gruntfile.js'], dest: '.'}
          ]
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
      },
      testTokenRenewal: {
        src: ['test/TokenRenewalSpec.js']
      }
    },

    jshint: {
      tests: {
        options: {
          '-W030': true,
        },
        src: ['test/**.js']
      },
      app: ['Gruntfile.js', 'server/server.js', 'app/routes.js']
    }
  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-git-revision');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint:app', 'nodemon']);
  grunt.registerTask('test', ['jshint:tests', 'mochaTest:testLogReg', 'mochaTest:testUser', 'mochaTest:testFriends', 'mochaTest:testLocation', 'mochaTest:testTokenRenewal']);
  grunt.registerTask('testLogReg', ['mochaTest:testLogReg']);
  grunt.registerTask('testUser', ['mochaTest:testUser']);
  grunt.registerTask('testFriends', ['mochaTest:testFriends']);
  grunt.registerTask('testLocation', ['mochaTest:testLocation']);
  grunt.registerTask('testTokRen', ['mochaTest:testTokenRenewal']);
  grunt.registerTask('dist', ['jshint', 'mochaTest', 'revision', 'compress']);
};