var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var minifyjs = require('gulp-minify');

gulp.task('minify-css', function() {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 5 versions'))
        .pipe(minify())
        .pipe(gulp.dest('dist/css/'))
});


gulp.task('compress-js', function() {
	gulp.src('src/js/*.js')
		.pipe(minifyjs({
			exclude: ['tasks'],
			ignoreFiles: ['.combo.js', '-min.js']
		}))
		.pipe(gulp.dest('dist/js/'))
});

gulp.task('move-lib-js', function() {
	gulp.src('src/lib/*.js')
		.pipe(gulp.dest('dist/js/'))
});

gulp.task('move-fonts', function() {
    gulp.src('src/fonts/*.{eot,otf,svg,ttf,woff}')
        .pipe(gulp.dest('dist/fonts/'))
});

//Watch task
gulp.task('default',function() {
    gulp.start('minify-css');
    gulp.start('compress-js');
    gulp.start('move-lib-js');
    gulp.start('move-fonts');
    gulp.watch('src/lib/**/*.js', ['move-lib-js']);
    gulp.watch('src/fonts/**/*.{eot,otf,svg,ttf,woff}', ['move-fonts']);
    gulp.watch('src/sass/**/*.scss',['minify-css']);
    gulp.watch('src/js/**/*.js', ['compress-js']);
});