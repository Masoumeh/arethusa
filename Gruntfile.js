"use strict";

var srcFiles = 'app/**/*.js';
var htmlFiles = 'app/**/*.html';
var cssFiles = 'app/**/*.scss';
var specFiles = 'spec/**/*.js';
var specE2eFiles = 'spec-e2e/**/*.js';
var devServerPort = 8081;
var reloadPort = 35279;

function getReloadPort() {
  reloadPort++;
  return reloadPort;
}

function mountFolder(connect, dir) {
  return connect.static(require('path').resolve(dir));
}

function pluginFiles(name) {
  var minName = 'dist/' + name + '.min.js';
  var mainFile = 'app/js/' + name + '.js';
  var others = '<%= "app/js/' + name + '/**/*.js" %>';
  var obj = {};
  obj[minName] = [mainFile, others];
  return obj;
}

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('create-final-js', function() {
    var template = grunt.file.read('./app/main_template.js');
    var content = grunt.file.read('./dist/all.min.js');

    var result = template.replace('{{text}}', content);
    grunt.file.write('./dist/arethusa.min.js', result);
  })
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: srcFiles,
      options: {
        specs: specFiles,
        // helpers: 'spec/*Helper.js',
        // template: 'custom.tmpl'
      }
    },
    watch: {
      default: {
        files: [srcFiles, specFiles],
        tasks: 'default'
      },
      spec: {
        files: [srcFiles, specFiles],
        tasks: 'spec'
      },
      server: {
        files: [srcFiles, htmlFiles, cssFiles],
        tasks: 'dist',
        options: {
          livereload: true
        }
      },
      serverNoCss: {
        files: [srcFiles, htmlFiles],
        tasks: ['minify', 'create-final-js'],
        options: {
          livereload: true
        }
      },
      serverCss: {
        files: cssFiles,
        tasks: 'minify:css',
      },

      e2e: {
        files: [srcFiles, specE2eFiles],
        tasks: 'protractor:all'
      }
    },
    jshint: {
      options: {
        jshintrc: true,
      },
      all: ['*.js', srcFiles, specFiles]
    },
    karma: {
      spec: {
        autoWatch: false,
        singleRun: true,
        options: {
          files : [
            './bower_components/angular/angular.js',
            './bower_components/angular-mocks/angular-mocks.js',
            './bower_components/angular-route/angular-route.js',
            './vendor/angular-resource/angular-resource.js',
            './bower_components/angular-cookies/angular-cookies.js',
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-scroll/angular-scroll.js',
            './bower_components/angular-translate/angular-translate.js',
            './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            './bower_components/angulartics/dist/angulartics.min.js',
            './bower_components/angulartics/dist/angulartics-ga.min.js',
            './bower_components/x2js/xml2json.min.js',
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/d3/d3.min.js',
            './bower_components/lunr.js/lunr.min.js',
            './vendor/angular-foundation-colorpicker/js/foundation-colorpicker-module.js',
            './vendor/mm-foundation/mm-foundation-tpls-0.1.0.min.js',
            // './vendor/dagre-d3/dagre-d3.min.js',
            // Some source files we'll need to include manually, otherwise
            // the load order is wrong
            'app/js/*.js',
            'app/js/arethusa*/**/*.js',
            'app/js/util/**/*.js',
            specFiles
          ],
          exclude: ['app/config.js'],
          frameworks: ['jasmine'],
          browsers : ['PhantomJS'],
          plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-coverage'
          ],
          reporters: ['progress', 'coverage'],
          preprocessors: {
            'app/**/*.js': ['coverage']
          },
          coverageReporter: {
            reporters: [
              {type: 'html', dir:'coverage/'},
              {type: 'lcov'},
            ]
          }
        }
      },
    },
    coveralls: {
      src: 'coverage/**/lcov.info'
    },
    protractor: {
      options: {
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
      },
      all: {
        options: {
          args: {
            seleniumAddress: 'http://localhost:4444/wd/hub',
            specs: [specE2eFiles],
            multiCapabilities: [{'browserName': 'firefox'}, {'browserName': 'chrome'}],
            //capabilities: {'browserName': 'firefox'},
            baseUrl: 'http://localhost:' + devServerPort
          }},
      }, // A target needs to be defined, otherwise protractor won't run
      travis: {
        options: {
          args: {
            sauceUser: 'arethusa',
            sauceKey: '8e76fe91-f0f5-4e47-b839-0b04305a5a5c',
            specs: [specE2eFiles],
            baseUrl: 'http://localhost:' + devServerPort,
            multiCapabilities: [{
              browserName: "firefox",
              version: "26",
              platform: "XP"
            }, {
              browserName: "chrome",
              platform: "XP"
            }, {
              browserName: "chrome",
              platform: "linux"
            }, {
              browserName: "internet explorer",
              platform: "WIN8",
              version: "10"
            }, {
              browserName: "internet explorer",
              platform: "VISTA",
              version: "9"
            }
            ],
            capabilities: {
              /* global process:true */
              'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
              'build': process.env.TRAVIS_BUILD_NUMBER
            }
          }
        }
      }
    },
    connect: {
      devserver: {
        options: {
          port: devServerPort,
          debug: true,
          keepalive: true,
          livereload: true,
          middleware: function(connect) {
            return [
              require('connect-livereload')(),
              mountFolder(connect, './')
            ];
          }
        }
      },
    },
    sauce_connect: {
      your_target: {
        options: {
          username: 'arethusa',
          accessKey: '8e76fe91-f0f5-4e47-b839-0b04305a5a5c',
          verbose: true
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true
      },
      main: { files: pluginFiles('arethusa') },
      core: { files: pluginFiles('arethusa.core') },
      comments: { files: pluginFiles('arethusa.comments') },
      hebrewMorph: { files: pluginFiles('arethusa.hebrew_morph') },
      artificialToken: { files: pluginFiles('arethusa.artificial_token') },
      contextMenu: { files: pluginFiles('arethusa.context_menu') },
      confEditor: { files: pluginFiles('arethusa.conf_editor') },
      morph: { files: pluginFiles('arethusa.morph') },
      review: { files: pluginFiles('arethusa.review') },
      search: { files: pluginFiles('arethusa.search') },
      depTree: { files: pluginFiles('arethusa.dep_tree') },
      hist: { files: pluginFiles('arethusa.hist') },
      relation: { files: pluginFiles('arethusa.relation') },
      exercise: { files: pluginFiles('arethusa.exercise') },
      sg: { files: pluginFiles('arethusa.sg') },
      text: { files: pluginFiles('arethusa.text') },
      dagred3: { files: { "vendor/dagre-d3/dagre-d3.min.js": "vendor/dagre-d3/dagre-d3.js"} },
      uservoice: { files: { "vendor/uservoice/uservoice.min.js": "vendor/uservoice/uservoice.js"} },
      templates: { files: { "dist/templates.min.js": "app/templates/templates.js"} },
      util: { files: { "dist/arethusa_util.min.js": "app/js/util/**/*.js" } },
      external: { files: { "dist/arethusa_external.min.js": "app/js/external/**/*.js" } },
      arethusa: { files: { "dist/all.min.js": [
        "dist/arethusa_util.min.js",
        "dist/arethusa.core.min.js",
        "dist/arethusa.artificial_token.min.js",
        "dist/arethusa.context_menu.min.js",
        "dist/arethusa.conf_editor.min.js",
        "dist/arethusa.morph.min.js",
        "dist/arethusa.review.min.js",
        "dist/arethusa.search.min.js",
        "dist/arethusa.dep_tree.min.js",
        "dist/arethusa.hist.min.js",
        "dist/arethusa.relation.min.js",
        "dist/arethusa.exercise.min.js",
        "dist/arethusa.sg.min.js",
        "dist/arethusa.text.min.js",
        "dist/arethusa.min.js",
        "dist/arethusa_external.min.js",
        "dist/templates.min.js"
      ]}}
    },
    sass: {
      dist: {
        options: {
          sourcemap: true
        },
        files: {
          'app/css/arethusa.css': 'app/css/arethusa.scss'
        }
      }
    },
    cssmin: {
      css: {
        src: ['app/css/arethusa.css', 'app/css/fonts/**/*.css'],
        dest: 'dist/arethusa.min.css'
      }
    },
    githooks: {
      precommit: {
        options: {
          'template': 'hooks/staging_only.js'
        },
        'pre-commit': 'default'
      },
      update: {
        options: {
          template: 'hooks/update.js'
        },
        'post-merge': true,
        'post-checkout': true
      }
    },
    ngtemplates: {
      arethusa: {
        cwd: "app",
        src: "templates/**/*.html",
        dest: "app/templates/templates.js"
      }
    }
  });

  grunt.registerTask('default', ['karma:spec', 'jshint']);
  grunt.registerTask('spec', 'karma:spec');
  grunt.registerTask('e2e', 'protractor:all');
  grunt.registerTask('dist', ['minify:all', 'create-final-js']);
  grunt.registerTask('server', ['dist', 'connect:devserver']);
  // Ok, the concurrent watches don't work, because the grunt contrib server
  // is listening only to one port :( Fix this at a later stage.
  //grunt.registerTask('reloader', 'concurrent:watches'); // ok, it doesn't work...
  grunt.registerTask('reloader', 'watch:server');
  grunt.registerTask('reloader:no-css', 'watch:serverNoCss');
  grunt.registerTask('reloader:css', 'watch:serverCss');
  grunt.registerTask('minify:css', ['sass', 'cssmin:css']);
  grunt.registerTask('minify', [
    'uglify:comments',
    'uglify:hebrewMorph',
    'uglify:main',
    'uglify:util',
    'uglify:artificialToken',
    'uglify:core',
    'uglify:morph',
    'uglify:contextMenu',
    'uglify:confEditor',
    'uglify:review',
    'uglify:search',
    'uglify:depTree',
    'uglify:hist',
    'uglify:relation',
    'uglify:exercise',
    'uglify:sg',
    'uglify:external',
    'uglify:text',
    'ngtemplates',
    'uglify:templates',
    'uglify:arethusa'
  ]);
  grunt.registerTask('minify:all', ['minify:css', 'minify']);
  grunt.registerTask('sauce', ['sauce_connect', 'protractor:travis', 'sauce-connect-close']);
};
