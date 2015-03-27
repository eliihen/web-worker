module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: [
        '/**',
        ' * <%= pkg.description %>',
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        ' * @link <%= pkg.homepage %>',
        ' * @author <%= pkg.author %>',
        ' * @license MIT License, http://www.opensource.org/licenses/MIT',
        ' */'
      ].join('\n')
    },
    dirs: {
      dest: 'dist'
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>' + '\n' +
            '(function ( window, angular, undefined ) {' + '\n',
        footer: '})( window, window.angular );'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
      }
    },
    zip: {
      '<%= dirs.dest %>/angular-filter.zip': [
        '<%= dirs.dest %>/<%= pkg.name %>.js',
        '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      ]
    },
    bowerInstall: {
      install: {
        options: {
          targetDir: './bower_components'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        jshintrc: true
      }
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js'
      },
      build: {
        singleRun: true,
        autoWatch: false
      },
      debug: {
        singleRun: false,
        autoWatch: true,
        browsers: ['PhantomJS']
      },
      travis: {
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
      },
      dev: {
        autoWatch: true
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },
    coveralls: {
      options: {
        force: true,
        recursive: true
      },
      all: {
        src: 'test/coverage/**/lcov.info'
      }
    }
  });

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-bower-task');

  grunt.renameTask('bower', 'bowerInstall');

  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-conventional-changelog');

  grunt.loadNpmTasks('grunt-zip');

  grunt.loadNpmTasks('grunt-coveralls');

  // Default task.
  grunt.registerTask('default', ['build']);

  // Build task.
  grunt.registerTask('build', ['bowerInstall', 'karma:build', 'concat', 'uglify', 'zip', 'coveralls']);

  grunt.registerTask('test', ['karma:build']);

  grunt.registerTask('test-debug', ['karma:debug']);

  grunt.registerTask('travis', ['karma:travis']);
};