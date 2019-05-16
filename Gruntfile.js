
"use strict";

module.exports = function(grunt)
{
  //Display the elapsed execution time of grunt tasks
  require("time-grunt")(grunt);

  //Loads required modules by task name (the second parameter of registerTask below)
  //modules must still be installed
  require("jit-grunt")(grunt);

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
    }
  });

  //registers the sass task defined in the initConfig under "css" key, to be
  //run with "grunt css" in the cmd.
  grunt.registerTask("css", ["sass"]);

  //watch task must be last or it will stop all other tasks every time it has
  //to run due to files modified. A "default" task will get executed with simply
  //typing "grunt" in cmd
  grunt.registerTask("default", ["browserSync", "watch"]);
};
