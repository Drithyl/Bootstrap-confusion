
"use strict";

module.exports = function(grunt)
{
  //Display the elapsed execution time of grunt tasks
  require("time-grunt")(grunt);

  //Loads required modules by task name (the second parameter of registerTask below)
  //modules must still be installed. The second parameter of the second call in the
  //require maps defined task names to modules, for some cases in which these don't match
  require("jit-grunt")(grunt, {
    useminPrepare: "grunt-usemin"
  });

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          //output css / input scss to convert
          "css/styles.css": "css/styles.scss"
        }
      }
    },

    //will keep watch of all .scss files. If any is modified, execute the tasks
    //declared below files:
    watch: {
      files: "css/*.scss",
      tasks: ["sass"]
    },

    //read grunt-browser-sync module documentation for details on this config
    browserSync: {
      dev: {
        //keep watch of all these files and reload browser when they get modified
        bsFiles: {
          src: [
            "css/*.css",
            "*.html",
            "js/*.js"
          ]
        },

        options: {
          watchTask: true,
          server: {
            baseDir: "./"
          }
        }
      }
    },

    //define copy task to copy HTML and fonts
    copy: {
      html: {
        files: [{
          expand: true,
          dot: true,
          //current working directory of the task
          cwd: "./",
          //source files to copy
          src: ["*.html"],
          //destination path
          dest: "dist"
        }]
      },

      fonts: {
        files: [{
          expand: true,
          dot: true,
          cwd: "node_modules/font-awesome",
          src: ["fonts/*.*"],
          dest: "dist"
        }]
      }
    },

    //define the task to clean the dist directory
    clean: {
      build: {
        src: ["dist/"]
      }
    },

    //define the task to minify the images
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          dot: true,
          cwd: "./",
          //minify all pngs, jpgs and gifs
          src: ["img/*.{png,jpg,gif}"],
          dest: "dist"
        }]
      }
    },

    //usemin needs this task to work with grunt. It will prepare the files
    //and configure the concat, cssmin, uglify and filerev plugins to work
    useminPrepare: {
      //random name?
      foo: {
        dest: "dist",
        src: ["contactus.html", "aboutus.html", "index.html"]
      },

      options: {
        flow: {
          steps: {
            css: ["cssmin"],
            js: ["uglify"]
          },

          post: {
            css: [{
              name: "cssmin",
              createConfig: function(context, block)
              {
                var generated = context.options.generated;
                generated.options = {
                  keepSpecialComments: 0, rebase: false
                }
              }
            }]
          }
        }
      }
    },

    //task to concatenate files into a single one
    concat: {
      options: {
        separator: ";"
      },

      dist: {}
    },

    //task to uglify the js files. Specify an empty dist
    uglify: {
      dist: {}
    },

    //task to minify the css files
    cssmin: {
      dist: {}
    },

    //filerev (file revision) adds an extension to the name of the css and js files
    //every time the project is built, to make sure that browsers don't cache these
    //files and choose not to download them again after an update
    filerev: {
      options: {
        encoding: "utf8",
        algorithm: "md5",
        length: 20
      },

      release:{
        files: [{
          src: [
            "dist/js/*.js",
            "dist/css/*.css"
          ]
        }]
      }
    },

    //will result in main.css and main.js files being created
    usemin: {
      html: ["dist/contactus.html", "dist/aboutus.html", "dist/index.html"],
      options: {
        assetsDirs: ["dist", "dist/css", "dist/js"]
      }
    },

    //task to minify the html files. Needs to run after usemin because the html
    //files will be minified based on the above usemin task that concatenates
    //css and js into a single file (so the html files need to change their references)
    htmlmin: {
      dist: {
        options: {
          //all whitespace will be collapsed to contain the minimum
          collapsedWhitespace: true,
        },

        files: {
          //destination:source is the format; replace the files with the minified ones
          "dist/index.html": "dist/index.html",
          "dist/contactus.html": "dist/contactus.html",
          "dist/aboutus.html": "dist/aboutus.html"
        }
      }
    }
  });

  //registers the sass task defined in the initConfig under "css" key, to be
  //run with "grunt css" in the cmd.
  grunt.registerTask("css", ["sass"]);

  //watch task must be last or it will stop all other tasks every time it has
  //to run due to files modified. A "default" task will get executed with simply
  //typing "grunt" in cmd
  grunt.registerTask("default", ["browserSync", "watch"]);

  //Register the build task to execute the tasks defined above
  grunt.registerTask("build", [
    //clean dist dir
    "clean",
    //copy required files (fonts, CSS, HTML, JS)
    "copy",
    //minify images
    "imagemin",
    //prepare files for minification
    "useminPrepare",
    //concat CSS and JS files into a main file
    "concat",
    //minify the main.css file generated
    "cssmin",
    //minify and mangle the main.js file generated
    "uglify",
    //add version to files
    "filerev",
    //replaces references of non minified files into the html files with their minified versions
    "usemin",
    //minify the html files
    "htmlmin"
  ]);
};
