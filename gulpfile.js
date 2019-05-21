"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");

/********************************************************************************
*   Gulp operates with filestreams. gulp.src() grabs a file glob and turns it   *
*   into a stream that can be piped to do transformations on it. Once all the   *
*   desired transformations are done it can be ended with one last .pipe() that *
*   uses gulp.dest() to specify a destination path for the final files.         *
********************************************************************************/

//"sass" will be the gulp command to type to run this task
gulp.task("sass", function()
{
  //grab all .scss files inside /css
  return gulp.src("./css/*.scss")
  //pipe them through the gulp-sass module
  .pipe(sass().on("error", sass.logError))
  //pipe them through to the final destination
  .pipe(gulp.dest("./css"));
});

gulp.task("sass:watch", function()
{
  //watch is already built into gulp. Whenever any of the files specified
  //in the first argument are changed, the tasks specified in the second
  //argument get run automatically.
  gulp.watch("./css/*.scss", ["sass"]);
});

gulp.task("browser-sync", function()
{
  //set up an array that determines which files will cause the browser
  //to resync the page whenever they get changed
  let files =
  [
    "./*.html",
    "./css/*.css",
    "./js/*.js",
    "./img/*.{png, jpg, gif}"
  ];

  //init the browserSync module with the array we defined specify the base
  //dir for the relative files
  browserSync.init(files,
  {
    server:
    {
      baseDir: "./"
    }
  });
});

//a "default" task gets executed just by using the "gulp" command. In the second
//parameter we use gulp. to call either gulp.series() or gulp.parallel() to declare
//tasks inside in the form of strings, one after another, depending on whether we
//need them running in parallel or one after the other. The last argument of series()
//or parallel() is the callback function to run after that is done. For more details, see
// https://fettblog.eu/gulp-4-parallel-and-series/
gulp.task("default", gulp.series("browser-sync", function()
{
  gulp.start("sass:watch");
}));
