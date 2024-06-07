// NPM PACKAGES
const { src, dest, series, parallel, watch } = require("gulp")
const browserSync = require('browser-sync').create()
const nodesass = require("gulp-sass")(require("sass"))
const babel = require("gulp-babel")
const concat = require("gulp-concat")
const plumber = require("gulp-plumber")

// COMPILE JS FILE
const scripts = () => {
    const uglify  = require('gulp-uglify')
  
    return (
      src('./assets/js/main.js')
      .pipe(plumber())
      .pipe(concat(`main.build.js`))      
      .pipe(uglify())
      .pipe(dest('dist/js/'))
    )
  }
  
  // COMPILE SCSS TO SCSS
  const sass = () => {
    const sourcemaps = require("gulp-sourcemaps")
  
    return (
      src('./assets/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(nodesass.sync().on("error", nodesass.logError))
      .pipe(sourcemaps.write())
      .pipe(dest('dist/css/'))
      .pipe(browserSync.stream())
    )
  }

  // RELOAD
const serverReload = (done) => {
    browserSync.reload()
    done()
  }
  

  // WATCH TASK
const watching = () => {
    return (
      watch('./assets/scss/**/*.scss', series(sass, serverReload)),
      watch("./assets/**/*.js", series(scripts, serverReload))
    )
  }

  // SERVER
const server = (done) => {
    browserSync.init({
    //   proxy: `${SITE_URL}`
    });
    watch('./assets/scss/**/*.scss', series(sass, serverReload)),
    watch("./assets/**/*.js", series(scripts, serverReload))
  }
  
  // Export Watch 
  exports.watch = watching;
  exports.dev = server;
  exports.scripts = scripts;
  
  // Tasks Default
  exports.default = series(sass, scripts)
  