//引入gulp和gulp插件
var gulp = require('gulp'),
    assetRev = require('gulp-asset-rev'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

// ** 根据项目情况定义css、js源文件路径，原则是根据gulpfile.js的位置设置相对路径 **
var cssSrc = 'css/*.css',
    jsSrc = 'js/*.js';

// CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
    return gulp.src(cssSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

// js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
    return gulp.src(jsSrc)
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});

// 将替换完的html保存到rev/html文件夹下
gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json', '*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('rev/html'));
});

//定义默认的任务
gulp.task('default', function (done) {
    condition = false;
    runSequence(       //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
        ['assetRev'],
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        done);
});