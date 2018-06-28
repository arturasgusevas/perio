const gulp        = require('gulp');
const sass        = require('gulp-sass');

const postcss     = require('gulp-postcss');
const stylelint   = require('stylelint');
const syntax_scss = require('postcss-scss');
const reporter    = require('postcss-reporter');

const browserSync = require('browser-sync').create();

const stylelintConfig = {
  "rules": {
    "color-no-invalid-hex": true,
    "selector-no-vendor-prefix": true,
    "property-no-vendor-prefix": true,
    "block-no-empty": true,
    "font-family-no-duplicate-names": true,
    "font-family-no-missing-generic-family-keyword": true,
    "unit-no-unknown": true,
    "property-no-unknown": true,
    "declaration-block-no-duplicate-properties": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-element-no-unknown": true,
    "selector-type-no-unknown": true,
    "no-duplicate-selectors": true,
    "no-extra-semicolons": true,
    "selector-max-id": 0
  }
}

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('styles', function () {

  const css_processor = [
    require('autoprefixer')()
  ];

  const scss_processor = [
    stylelint(stylelintConfig),
    reporter({
    clearMessages: true,
    throwError: true
    })
  ];

  gulp.src('app/scss/style.scss')
      // lint scss file
      .pipe(postcss(scss_processor, {syntax: syntax_scss}))
      // Convert to css
      .pipe(sass({'outputStyle': 'normal'}))
      // Autoprefix css and compress it
      .pipe(postcss(css_processor))
      // Move it to the correct directory
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.stream());

});

gulp.task('watch',['browser-sync'], function(){
  gulp.watch('app/*.html', browserSync.reload);
})

gulp.task('default', ['styles', 'browser-sync', 'watch'], function() {
	gulp.watch('app/scss/*.scss', ['styles']);
})
