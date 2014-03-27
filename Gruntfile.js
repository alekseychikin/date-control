/*
 * grunt-include-js
 * https://github.com/makingoff/include-js
 *
 * Copyright (c) 2014 makingoff
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    include_js: {
      default_options: {
        files: {
          'tmp/custom_options_first-set.html': [
            'js/script_one.js',
            'js/script_two.js'
          ]
        }
      },
      custom_options: {
        options: {
          required: [
            'js/module_one.js',
            'js/module_two.js'
          ],
          prefix: '../'
        },
        files: {
          'tmp/custom_options_second-set.html': [
            'js/script_one.js',
            'js/script_two.js',
            'js/script_three.js'
          ],
          'tmp/custom_options_third-set.html': [
            'js/script_four.js',
            'js/script_five.js'
          ]
        }
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

    copy: {
      tests: {
        expand: true,
        cwd: 'templates/',
        src: '**',
        dest: 'tmp/'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copy', 'include_js', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
