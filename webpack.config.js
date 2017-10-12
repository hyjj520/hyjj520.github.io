const webpack=require('webpack');
const path=require('path');
//源码目录
const srcPath=path.resolve(__dirname,'src');



module.exports={
    entry:{
        'common/main':[srcPath+'/common/main.js','webpack-hot-middleware/client?reload=true']//4  指定重载策略，修改了前端代码js,css后，浏览器会自动刷新
    },
    output:{
        path:__dirname+'/public',
        filename:'[name].js',
        //publicPath:'http://localhost:8080/public',
        publicPath:'http://localhost:3000/public',//这里的地址要换成代理服务器的地址
    },
    devtool:'eval-source-map',//2
    module:{
        rules:[
            {
                test:/\.(png|jpg)$/,
                //如果图片小于8k  8192byte  就将图片Base64编码成字符串
                use:'url-loader?limit=8192&context=client&name=[name].[ext]'
            },
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader?sourceMap' //2
                ]
            }


        ]
    },
    plugins:[
        new webpack.optimize.OccurrenceOrderPlugin(),//根据模块的调用次数，给模块分配id，使得id可预测，降低文件大小 
        new webpack.HotModuleReplacementPlugin(), // 1.启用 HMR，模块热替换
        new webpack.NoEmitOnErrorsPlugin() //报错但不退出webpack的进程
    ]


};


