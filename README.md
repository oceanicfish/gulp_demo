# Node JS 安装

NodeJS下载地址
    https://nodejs.org/

NodeJS 安装是否成功检查，成功安装后，应该有npm的版本号

```npm -v```

初始化NodeJS项目
```npm init```

### 这里貌似对NodeJS版本没有特殊要求，为了以防万一，我使用的NodeJS 版本是v10.16.0, npm版本是6.14.5

### 执行 init 时，除了最后一步输入 [yes]以外，其他一律默认按回车也可以. 按照规则输入项目名称等信息也可以，按照项目情况输入即可。

# 安装 Gulp

## 安装gulp和gulp插件
```
npm install gulp@3.9.1  
npm install gulp-rev
npm install gulp-rev-collector
npm install gulp-asset-rev
npm install run-sequence
npm install gulp-cli
```
### ** 第一个gulp插件的版本要注意！ 一定要用3，不要用最新的gulp 4 因为gulp 4 以后的语法发生很大改变。gulp 3 的方法在 gulp 4上不能运行！！！ 其他插件的版本没有特殊要求，最新版即可**

### 如果是在Mac或者Linux上安装的话，需要注意权限问题，可能需要Sudo权限。比如： 
```
sudo npm install gulp@3.9.1
...
```


## 在项目根目录下创建 gulpfile.js (参考gulp_demo项目的结构)
```
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
```
## 修改配置文件

修改gulp-rev和gulp-rev-collector

打开node_modules\gulp-rev\index.js
```
第135行 manifest[originalFile] = revisionedFile;
更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;
```

打开node_modules\gulp-rev-collector\index.js
```
40行的 let cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
更新为: let cleanReplacement =  path.basename(json[key]).split('?')[0];
```

打开node_modules\gulp-assets-rev\index.js
```
78行 var verStr = (options.verConnecter || "-") + md5;
更新为：var verStr = (options.verConnecter || "") + md5;
80行 src = src.replace(verStr, '').replace(/(\.[^\.]+)$/, verStr + "$1");
更新为：src=src+"?v="+verStr;
```

## 执行gulp

在项目根目录下，用终端或者windows的cmd执行
```
gulp
```

执行以后，会出现下列信息
```
[11:52:18] Starting 'default'...
[11:52:18] Starting 'revCss'...
[11:52:18] Finished 'revCss' after 48 ms
[11:52:18] Starting 'revJs'...
[11:52:18] Finished 'revJs' after 19 ms
[11:52:18] Starting 'revHtml'...
[11:52:18] Finished 'revHtml' after 36 ms
[11:52:18] Finished 'default' after 123 ms
```

然后在 `pipe(gulp.dest('rev/html'));`指定的位置可以找到改变版本以后的HTML文件。