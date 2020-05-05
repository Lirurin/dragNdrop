const gulp = require('gulp'),
	glp = require('gulp-load-plugins')(),
	del = require('del'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserSync = require('browser-sync').create();

gulp.task('pug', function() {
	return gulp.src('app/*.pug')
	.pipe(glp.pug({
		pretty: true
	}))
	.pipe(gulp.dest('dist/'))
	.on('end', browserSync.reload)
});

gulp.task('stylus', function() {
	return gulp.src('app/css/*.styl')
	.pipe(glp.stylus({
		'include css': true
	}))
	.pipe(glp.autoprefixer({}))
	.pipe(glp.concat('main.css'))
	// .pipe(glp.csso())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('css', function() {
	return gulp.src('app/css/*.css')
	// .pipe(glp.csso())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});


gulp.task('scripts', function() {
    return browserify('app/js/main.js')
        .transform('babelify', {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(glp.uglify())
        .pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts:libs', function() {
	return gulp.src('app/js/libs/*.js')
	.pipe(glp.uglify())
	.pipe(gulp.dest('dist/js/libs'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('static', function() {
	return gulp.src('app/static/**/*.*')
	.pipe(gulp.dest('dist/'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('img:dev', function() {
	return gulp.src('app/img/**/*.*')
	.pipe(gulp.dest('dist/img'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('img:build', function() {
	return gulp.src('app/img/**/*.*')
	.pipe(glp.tinypng('Kk_P4FyRoQGwHhY6jEVHty1sIfNxFkKN'))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('html:dev', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('html:build', function() {
	return gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))
});

gulp.task('favicon:build', function() {
    return gulp.src('app/favicon/*.*')
        .pipe(gulp.dest('dist/favicon'))
});

gulp.task('font:build', function() {
	return gulp.src('app/font/*.*')
		.pipe(gulp.dest('dist/font'))
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: 'dist/'
		}
	})
});

gulp.task('watch', function() {
	gulp.watch('app/**/**/*.pug', gulp.series('pug'));
	gulp.watch('app/**/**/*.styl', gulp.series('stylus'));
	gulp.watch('app/**/**/*.css', gulp.series('stylus'));
	gulp.watch('app/**/**/*.js', gulp.series('scripts'));
	gulp.watch('app/js/libs/*.js', gulp.series('scripts:libs'));
	gulp.watch('app/static/**/*.*', gulp.series('static'));
	gulp.watch('app/img/**/*.*', gulp.series('img:dev'));
	gulp.watch('app/*.html', gulp.series('html:dev'))
	gulp.watch('app/css/*.css', gulp.series('css'))
});

gulp.task('default', gulp.series(
	gulp.parallel('pug', 'stylus', 'scripts:libs', 'scripts', 'static', 'img:dev', 'html:dev', 'css'),
	gulp.parallel('serve', 'watch')
));

gulp.task('build', gulp.series(
	// 'clean', 'pug', 'stylus', 'scripts', 'scripts:libs', 'static', 'img:build'
	'clean', 'pug', 'stylus', 'css', 'scripts', 'scripts:libs', 'static', 'html:build', 'font:build', 'favicon:build'
));

gulp.task('dirs', function () {
	return gulp.src('*.*', {read: false})
		.pipe(gulp.dest('./app'))
		.pipe(gulp.dest('./app/css'))
		.pipe(gulp.dest('./app/favicon'))
		.pipe(gulp.dest('./app/font'))
		.pipe(gulp.dest('./app/img'))
		.pipe(gulp.dest('./app/js'))
		.pipe(gulp.dest('./dist'))
});