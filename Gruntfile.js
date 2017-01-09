'use strict';

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    path: 'webapp/',
    pkg: grunt.file.readJSON('package-info.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',


    // Task configuration.

    clean: ["<%= path %>dist/*"],

    imagemin: {
      originalfiles: {
        files: [{
          expand: true,
          cwd: '<%= path %>src/images/',    // Src matches are relative to this path
          src: ['**/*.{jpg,gif,png}'],      // Actual patterns to match
          dest: '<%= path %>dist/images/'   // Destination path prefix
        }]
      },
      sizedFiles: {
        files: [{
          expand: true,
          cwd: '<%= path %>dist/images/sized',  // Src matches are relative to this path
          src: ['**/*.{jpg,gif}'],              // Actual patterns to match
          dest: '<%= path %>dist/images/sized'  // Destination path prefix
        }]
      },
    },
    pngmin: {
      compile: {
        options: {
          ext: '.png',
          force: true
        },
        files: [
          {
            expand: true,
            src: ['**/*.png'],
            cwd: '<%= path %>dist/images/',
            dest: '<%= path %>dist/images/',
          }
        ]
      }
    },
    sass: {
      combined: {
        options: {
          style: 'expanded',
          precision: 8,
        },
        files: [{
          src: '<%= path %>src/scss/style.scss',
          dest: '<%= path %>dist/css/style-unprefixed.min.css',

        }],
      },
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9', 'ie 10'],
        map: true
      },
      combined: {
        src: '<%= path %>dist/css/style-unprefixed.min.css',
        dest: '<%= path %>dist/css/style.min.css'
      },
    },
    jshint: {
      beforeconcat: ['<%= path %>src/js/application**/*.js'],
    },
    concat: {
      options: {
        stripBanners: false,
        separator: ';\n',
      },
      dist: {
        src: ['<%= path %>src/js/application/*.js'],
        dest: '<%= path %>dist/js/application.js'
      },
      vendor: {
        src: ['<%= path %>src/js/vendor/jquery-3.1.1.js'],
        dest: '<%= path %>dist/js/vendor.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        preserveComments: 'all',
      },
      dist: {
        files: {
            '<%= path %>dist/js/application.min.js': ['<%= path %>dist/js/application.js']
        },
      },
      vendor: {
        files: {
            '<%= path %>dist/js/vendor.min.js': ['<%= path %>dist/js/vendor.js']
        },
      },
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['svg/**/*'], dest: '<%= path %>dist/', cwd: '<%= path %>src'},
          {expand: true, src: ['fonts/*.{eot,svg,woff,ttf,woff2}'], dest: '<%= path %>dist/', cwd: '<%= path %>src'},
        ],
      },
    },
    watch: {
      options: {
        livereload: true,
      },
      css: {
        files: '<%= path %>src/scss/**/*.scss',
        tasks: ['sass', 'autoprefixer'],
        options: {
        },
      },
      js: {
        files: '<%= path %>src/js/application/*.js',
        tasks: ['jshint','concat:dist','uglify:dist'],
        options: {
        },
      },
    },
    // shell: {
    //   deployproof: {
    //     command: 'dandelion --config=proof.yml deploy refs/heads/develop',
    //     options: {
    //       execOptions: {
    //         maxBuffer: Infinity
    //       },
    //     },
    //   },
    // },
  });

/*
  jit-grunt loads plugins at runtime. Otherwise, plugins would be loaded here.

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-responsive-images-extender');

  Note: This is an incomplete list as example only. For full plugin list, open package.json

*/
  // Default task.
  grunt.registerTask('default', ['newer:imagemin','sass','autoprefixer','newer:jshint','newer:concat','newer:uglify','newer:copy:main']);
  grunt.registerTask('png', ['newer:pngmin']);
  // grunt.registerTask('proof', ['newer:imagemin','newer:sass','newer:autoprefixer','newer:jshint','newer:concat','newer:uglify','newer:copy','newer:pngmin','shell:deployproof']);
};
