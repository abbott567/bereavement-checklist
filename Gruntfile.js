'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    // Builds Sass
    sass: {
      dev: {
        options: {
          style: 'expanded',
          sourcemap: true,
          includePaths: [
            'govuk_modules/govuk_template/assets/stylesheets',
            'govuk_modules/govuk_frontend_toolkit/stylesheets'
          ],
          outputStyle: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'app/assets/sass',
          src: ['*.scss'],
          dest: 'public/stylesheets/',
          ext: '.css'
        }]
      }
    },

    // Copies templates and assets from external modules and dirs
    sync: {
      assets: {
        files: [{
          expand: true,
          cwd: 'app/assets/',
          src: ['**/*', '!sass/**'],
          dest: 'public/'
        }],
        ignoreInDest: '**/stylesheets/**',
        updateAndDelete: true
      },
      govuk: {
        files: [{
          cwd: 'node_modules/govuk_frontend_toolkit/',
          src: '**',
          dest: 'govuk_modules/govuk_frontend_toolkit/'
        },
        {
          cwd: 'node_modules/govuk_template_mustache/assets/',
          src: '**',
          dest: 'govuk_modules/govuk_template/assets/'
        },
        {
          cwd: 'node_modules/govuk_template_jinja/views/layouts/',
          src: '**',
          dest: 'govuk_modules/govuk_template_jinja/views/layouts/'
        },
        {
          cwd: 'node_modules/govuk-elements-sass/public/sass/',
          src: ['**', '!node_modules', '!elements-page.scss', '!elements-page-ie6.scss', '!elements-page-ie7.scss', '!elements-page-ie8.scss', '!main.scss', '!main-ie6.scss', '!main-ie7.scss', '!main-ie8.scss', '!prism.scss'],
          dest: 'govuk_modules/govuk-elements-sass/'
        }]
      },
      /* eslint-disable camelcase */
      govuk_template_jinja: {
        files: [{
          cwd: 'govuk_modules/govuk_template_jinja/views/layouts/',
          src: '**',
          dest: 'lib/'
        }]
      },
      govuk_elements: {
        files: [{
          cwd: 'govuk_modules/govuk-elements-sass',
          src: ['**'],
          dest: 'app/assets/sass/'
        }]
      }
      /* eslint-enable camelcase */
    },

    // Watches assets and sass for changes
    watch: {
      css: {
        files: ['app/assets/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      },
      assets: {
        files: ['app/assets/**/*', '!app/assets/sass/**'],
        tasks: ['sync:assets'],
        options: {
          spawn: false
        }
      }
    },

    // nodemon watches for changes and restarts app
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ext: 'js, json',
          ignore: ['node_modules/**', 'app/assets/**', 'public/**'],
          args: grunt.option.flags()
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['watch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  [
    'grunt-sync',
    'grunt-contrib-watch',
    'grunt-sass',
    'grunt-nodemon',
    'grunt-concurrent'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('generate-assets', [
    'sync',
    'sass'
  ]);

  grunt.registerTask('default', [
    'generate-assets',
    'concurrent:target'
  ]);

  grunt.registerTask(
    'test',
    'default',
    function () {
      grunt.log.writeln('Test that the app runs');
    }
  );

  grunt.loadNpmTasks('grunt-autoshot');
  grunt.registerTask('screenshots', function (input) {
    grunt.initConfig({
      autoshot: {
        default_options: {
          options: {
            path: './screenshots',
            remote: {
              files: screenshotUrls(input)
            },
            local: {
              path: './test/src',
              port: 8080,
              files: [
              ]
            },
            viewport: [
              '1920x1080',
              '320x580'
            ]
          }
        }
      }
    });
    grunt.task.run('autoshot');
  });

  function screenshotUrls(input) {
    const dir = input ? `${input}/` : '';
    const cwd = `app/views/${dir}`;
    const templates = grunt.file.expand({filter: "isFile", cwd}, ["**/*", "!includes/**"]);
    const urls = [];

    for (let i = 0; i < templates.length; i++) {
      let filename = templates[i].split('.').shift();
      urls.push({src: `http://localhost:3000/${dir}${filename}`, dest: `${filename}.png`});
    }
    return urls;
  }
};
