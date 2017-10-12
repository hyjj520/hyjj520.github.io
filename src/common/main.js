console.log('我是公共的js,很多页面都会引用我,也是入口文件');

require('../index/index');


//在入口文件加入下面这行代码，可以实现  修改了js文件后，ajax刷新
//不加的话  修改代码后整页直接刷新

if(module.hot){
    module.hot.accept();
}
