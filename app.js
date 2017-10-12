const express = require('express');
//引入模板
const swig = require('swig');
const app = express();


//模板配置--------------------------------
app.engine('html', swig.renderFile);
app.set('views', './server/views');
app.set('view engine', 'html');
//模板配置end-------------------------------

//取出设置的环境变量
console.log('取出的变量值', process.env.NODE_ENV);
//是否是开发模式
const isDev = process.env.NODE_ENV === 'dev';

if (isDev) {
    //模板不缓存
    swig.setDefaults({
        cache: false
    });
    //--------------node中调用webpack实现热刷新的中间件-----------------------------------------------
    //3.在这里调用webpack的配置
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.js');
    const compiler = webpack(webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        stats: {
            colors: true
        },
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
    //--------------node中调用webpack实现热刷新的中间件end-----------------------------------------------


    //------------------路由-------------------------------------------
    app.get('/', (req, res, next) => {
        res.render('index');
    });
    //引入路由
    app.use('/', require('./server/routers/api'));
    //-----------------路由end--------------------------------------------

    //引入browser-sync 模块，实现修改前端代码浏览器自动刷新
    const browserSync = require('browser-sync').create();
    //实现服务器重启以后浏览器能自动刷新
    const reload = require('reload');
    const http = require('http');
    const server = http.createServer(app);
    reload(app); //通知浏览器刷新 
    server.listen(8080, () => {


        //告诉 browserSync  我们监听哪个目录（配置）
        browserSync.init({
            ui: false,
            open: false,
            online: false, //离线工作模式，可以大大提高启动速度
            notify: false, //不显示在浏览器中的任何通知
            proxy: 'localhost:8080', //要代理的服务器地址
            files: './server/views/**', //监听被修改的代码
            port: 3000 //服务器启动的端口
        }, () => console.log('开发模式，代理服务器启动成功'));


    });

} else {

    //配置静态资源目录(可配置多个)  配置了上面的中间件，这行代码在开发时可以注释掉了
    //因为上面的热加载把编译后的文件放内存了，不放public的文件磁盘上了
    app.use('/public', express.static(__dirname + '/public'));
    app.get('/', (req, res, next) => {
        res.render('index');
    });
    //引入路由
    app.use('/', require('./server/routers/api'));

    app.listen(8080, () => {
        console.log('web应用启动成功');
    });
}