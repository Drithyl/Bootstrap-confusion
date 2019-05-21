"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const del = require("del");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const usemin = require("gulp-usemin");
const rev = require("gulp-rev");
const cleanCss = require("gulp-clean-css");
const flatmap = require("gulp-flatmap");
const htmlmin = require("gulp-htmlmin");

/********************************************************************************
*   Gulp operates with filestreams. gulp.src() grabs a file glob and turns it   *
*   into a stream that can be piped to do transformations on it. Once all the   *
*   desired transformations are done it can be ended with one last .pipe() that *
*   uses gulp.dest() to specify a destination path for the final files.         *
********************************************************************************/

/****************************************************************
*   For more information on Globs and globbing patterns         *
*   (the way we specify our wildcard files), see below:         *
*   https://gulpjs.com/docs/en/getting-started/explaining-globs *
****************************************************************/

/******************************************************************************
*   In the second parameter of gulp.task() we may use gulp. to call either    *
*   gulp.series() or gulp.parallel() to declare tasks inside in the form of   *
*   strings, one after another, depending on whether we need them running in  *
*   parallel or sequentially. The last argument of series() or parallel() is  *
*   the callback function to run after that is done. For more details, see    *
*   https://fettblog.eu/gulp-4-parallel-and-series/                           *
******************************************************************************/

/**********************************************************************************
*   Every second parameter and beyond given to gulp.task *must* signal async      *
*   completion, as all the tasks specified in here are asynchronous               *
*   This can be done in a variety of ways, all of them documented here:           *
*   https://gulpjs.com/docs/en/getting-started/async-completion                   *
*   One of the most common being to return the filestream that we use to operate  *
*   on different files through .pipe(), as seen in the "sass", "copyfonts" or     *
*   "imagemin" tasks below.                                                       *
**********************************************************************************/


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
  //to resync the page whenever they get changed, using Globs
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

//a "default" task gets executed just by using the "gulp" command
gulp.task("default", gulp.series("browser-sync", function()
{
  gulp.start("sass:watch");
}));

//will delete all directories included in the array passed into del()
gulp.task("clean", function()
{
  return del(["dist"]);
});

//we can use the built in gulp filestreams to copy the required font files
//using a Glob into our distribution folder.
gulp.task("copyfonts", function()
{
  return gulp.src("./node_modules/font-awesome/fonts/**/*.{ttf, woff, eof, svg}*")
  .pipe(gulp.dest("./dist/fonts"));
});

gulp.task("imagemin", function()
{
  //Glob to specify which images to minify
  return gulp.src("img/*.{png, jpg, gif}")
  //imagemin configuration specified within an object as parameter
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
  //pipe the resulting minified images to the destination
  .pipe(gulp.dest("dist/img"));
});

//gulp-usemin module replaces references to non-optimized scripts or stylesheets
//into a set of HTML files (or any templates/views). For more details see
//https://www.npmjs.com/package/gulp-usemin
gulp.task("usemin", function()
{
  return gulp.src("./*.html")
  //flatmap takes the multiple files and starts up parallel pipes for each of them
  //(kinda like doing a .every() call on an array and passing a function into it)
  .pipe(flatmap((stream, file) =>
  {
    return stream
    .pipe(usemin(
    {
      //rev module adds a 20 bit string to the CSS file namesso they'll get
      //redownloaded by the browser whenever they get updated
      css: [rev()],
      //minify the html code in the files, collapsing all whitespace
      html: [() => { return htmlmin({ collapseWhitespace: true }) }],
      //uglify all JS code in the html files, also add rev
      js: [uglify(), rev()],
      //uglify all the inline JS code
      inlinejs: [uglify()],
      inlinecss: [cleanCss(), "concat"]
    }))
  }))
  //pipe the final data to the dist folder
  .pipe(gulp.dest("dist/"));
});

//run the clean task first, then run copyfonts and imagemin in parallel
gulp.task("build", gulp.series("clean", gulp.parallel("copyfonts", "imagemin", "usemin")));
