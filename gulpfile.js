const path = require('path');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const server = path.resolve(__dirname, 'db');
const process = require('process')
const sh = require('shelljs')

// browser-sync配置，配置里启动nodemon任务
// gulp.task('browser-sync', ['nodemon'], function() {
//     browserSync.init(null, {
//         proxy: "http://localhost:3010", // 这里的端口和webpack的端口一致
//         port: 3030
//     });
// });

gulp.task('open-browser', function () {
    var platform = process.platform;
    var shellStr1 = "open -a '/Applications/Google Chrome.app' 'http://localhost:3010'";
    var shellStr2 = "start http://localhost:3010";
    // 打开浏览器方法：
    var openFunc = function (str, flag) {
        // 执行并对异常处理
        if (sh.exec(str).code !== 0) {
            sh.echo(flag + '下打开浏览器失败,建议您安装chrome并设为默认浏览器!');
            sh.exit(1);
        }
    };
    if (platform === 'darwin') {
        openFunc(shellStr1, 'Mac');
    } else if (platform === 'win32' || platform === 'win64') {
        openFunc(shellStr2, 'Windows');
    } else {
        sh.echo('现在只支持Mac和windows系统!如果未打开页面，请确认安装chrome并设为默认浏览器!');
    }
});

// browser-sync 监听文件
gulp.task('mock', ['nodemon'], function() {
    // gulp.watch(['./db/**'], ['nodemon']);
});

gulp.task('default', ['mock', 'open-browser']);

// 延时刷新
// gulp.task('bs-delay', function() {
//     setTimeout(function() {
//         browserSync.reload();
//     }, 1000);
// });

var started = false;
var len = 0;
// 服务器重启
gulp.task('nodemon', function(cb) {
    // 设个变量来防止重复重启
    var stream = nodemon({
        script: './server.js',
        // 监听文件的后缀
        ext: "js",
        env: {
            'NODE_ENV': 'development'
        },
        // // 监听的路径
        watch: [
            server
        ]
    });
    stream.on('start', function() {
        len++;
        console.log('start!')
        if (!started) {
            cb();
            started = true;
            setTimeout(function(){
                len--;
                started = false;
                if(len > 0){
                    stream.emit('restart', 10);
                    len = 0;
                }
            }, 500);
        }
    }).on('restart', function () {
        console.log('restarted!')
    }).on('crash', function() {
        console.error('application has crashed!\n')
        stream.emit('restart', 10)
    })
});