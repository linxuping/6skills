var gulp = require('gulp'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	react = require('gulp-react'),
	rev = require('gulp-rev'),                              //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),              //- 路径替换
    minimist = require('minimist'),
    gulpif = require('gulp-if');
    var plumber = require('gulp-plumber');
    var browsersync = require('browser-sync');
	var config      = require('./config').browsersync.development;

/**
 * Run the build task and start a server with BrowserSync
 */
gulp.task('browsersync', ['build'], function() {

});


var srcPath = "src/";
var distPath = "dist/static/";

// 源码路径
var src = {
	css: srcPath + "less",
	css2: srcPath + "css",
	img: srcPath + "img",
	js: srcPath + "js",
	lib: srcPath + "lib",
	tpl: srcPath + "template"
};

// 部署路径
var dist = {
	css: distPath + "css",
	img: distPath + "img",
	js: distPath + "js",
	lib: distPath + "lib",
	tpl: "dist/template"
}

var flag = false;         //- 是否生产部署

// 用户样式
gulp.task('styles', function(){
	return gulp.src([src.css + '/**/*.less', src.css + '/**/*.css'])
	.pipe(plumber())
	.pipe(less())
	//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	//.pipe(gulp.dest(dist.css))
	//.pipe(gulpif(flag, rename({suffix: '.min'})))

	.pipe(gulpif(flag, minifycss()))
	.pipe(gulpif(flag, rev()))                                      //- md5后缀

	.pipe(gulp.dest(dist.css))


	.pipe(gulpif(flag, rev.manifest()))                            //- 生成md5映射文件
	.pipe(gulpif(flag, gulp.dest(distPath + 'rev/styles')))         //- 替换映射文件保存路径

	.pipe(notify({message: 'styles task complete'}))
});


// gulp.task('styles2', function(){
// 	return gulp.src([src.css2 + '/*.css'])
// 	.pipe(gulp.dest(dist.css))
// });


// 库样式
// gulp.task('lib_styles', function(){
// 	return gulp.src([dist.lib + '/amazeui/css/amazeui.css', dist.lib + '/amazeui/css/admin.css'])
// 	.pipe(concat('amazeui_admin.css'))
// 	.pipe(gulp.dest('static/css'))
// 	.pipe(rename({suffix: '.min'}))
// 	.pipe(minifycss())
// 	.pipe(rev())                                      //- md5后缀
// 	.pipe(gulp.dest(dist.lib + '/amazeui/css'))
// 	.pipe(rev.manifest())							 //- 生成md5映射文件
// 	.pipe(gulp.dest('static/rev/lib_styles'))  		 //- 替换映射文件保存路径
//	.pipe(notify({message: 'lib styles complete'}))
// 	.pipe(livereload())
// })


// 用户脚本
gulp.task('scripts', function(){
	return gulp.src([src.js + '/**/*.js', '!' + src.js + "/modules/**"])
	.pipe(gulp.dest(dist.js))
	// .pipe(rename({suffix: '.min'}))

	// .pipe(gulpif(flag, uglify()))
	// .pipe(gulpif(flag, rev()))

	// .pipe(gulp.dest(dist.js))

	// .pipe(gulpif(flag, rev.manifest()))
	// .pipe(gulpif(flag, gulp.dest(distPath + "rev/scripts")))

	.pipe(notify({message: "user scripts complete"}))
})

// react 模块
gulp.task('react', function(){
	return gulp.src([src.js + '/modules/**'])
	.pipe(plumber())
	.pipe(react())
	.pipe(gulp.dest(dist.js + '/modules'))
	// .pipe(rename({suffix: '.min'}))

	.pipe(gulpif(flag, uglify()))
	.pipe(gulpif(flag, rev()))

	.pipe(gulp.dest(dist.js + '/modules'))

	.pipe(gulpif(flag, rev.manifest()))
	.pipe(gulpif(flag, gulp.dest(distPath + "rev/react_modules")))

	.pipe(notify({message: "user scripts complete"}))
})

// 库脚本
gulp.task('lib_scripts', function(){
	return gulp.src([src.js+'/jquery-3.0.0.min.js', src.js+'/react/react.js', src.js+'/react/react-dom.js'])
	.pipe(concat('lib.js'))
	.pipe(gulp.dest(dist.js + "/lib"))
	//.pipe(rename({suffix: '.min'}))

	.pipe(uglify())
	.pipe(rev())

	.pipe(gulp.dest(dist.js + "/lib"))

	.pipe(rev.manifest())
	.pipe(gulp.dest(distPath + "rev/lib_scripts"))

	.pipe(notify({message: 'lib scripts complete'}))
})


// 图片压缩
gulp.task('images', function(){
	return gulp.src(src.img + '/**/*')
	// .pipe(gulpif(flag, cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))))
	.pipe(gulp.dest(dist.img))
	.pipe(notify({message: "images complete"}))
})


// 把lib里的其他不合并的文件放过去，不一定用到；example不用
gulp.task('lib_other_files', function(){
	return gulp.src([src.lib + '/**/*', '!'+src.lib+'/react/examples/**'])
	.pipe(gulp.dest(dist.lib))
	.pipe(notify({message: "lib other files complete"}))
})

//部署前清理
gulp.task('clean', function(){
	return gulp.src([dist.img, dist.css, dist.js, dist.tpl])
	.pipe(clean())
})


// 模板
gulp.task('templates', ['scripts', 'styles', 'react'], function(){
	gulp.src([distPath + '/rev/**/*.json', src.tpl + '/**/*.html'])
	.pipe(gulpif(flag, revCollector({
        replaceReved: true,
        dirReplacements: {
            'css': "css",
            '/static/js/modules': "/static/js/modules",
            '/static/js/lib': '/static/js/lib'
            //'lib': '/static/lib'
            // 'cdn/': function(manifest_value) {
            //     return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
            // }
        }
    })))
	.pipe(gulp.dest(dist.tpl))
	//.pipe(livereload())
})


gulp.task('help',function () {

  console.log('	gulp build			生产部署打包');

  console.log('	gulp watch			文件监控打包');

  console.log('	gulp help			gulp参数说明');

});

/* 默认 */
gulp.task('default',function () {
	gulp.start('help');
});


// 文件监护
gulp.task('watch', function(){

	livereload.listen({"quiet": false})
	// 监护scss文件
	gulp.watch(src.css + '/**/*.less', ['styles']);

	// 监护js
	gulp.watch([src.js + '/**/*.js', '!' + src.js + '/modules/**/*.js'], ['scripts']);

	// 监护react模块
	gulp.watch(src.js + '/modules/**/*.js', ['react'])

	// 监护img
	gulp.watch(src.img + '/**/*', ['images']);

	// 监护模板
	gulp.watch(src.tpl + '/**/*', ['templates']);

	browsersync(config);

	// var server = livereload();

	// gulp.watch(['static/**/*', 'WEB-INF/jsp/**/*'], function(file){

	// })
});


// 生产部署
gulp.task("build", ['clean'], function(){
	flag = true;

	// 库
	gulp.start(['lib_scripts', 'lib_other_files'])

	// 用户数据
	gulp.start(['styles', 'scripts', 'react', 'images']);

	// jsp模板
	gulp.start('templates');
})


// 开发第一次部署
gulp.task("build-dev", ['clean'], function(){

	// 库
	gulp.start(['lib_scripts', 'lib_other_files'])

	// 用户数据
	gulp.start(['styles', 'scripts', 'react', 'images']);

	// jsp模板
	gulp.start('templates');
})
