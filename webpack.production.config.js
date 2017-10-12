const webpack=require('webpack');
const path=require('path');
//源码目录
const srcPath=path.resolve(__dirname,'src');
//用来清除文件的插件 ，每次编译前都会执行
var CleanWebpackPlugin = require('clean-webpack-plugin');
//用来将css单独提取出来的插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");



module.exports={
    entry:{
        'common/main':[srcPath+'/common/main.js']
    },
    output:{
        path:__dirname+'/public',
        filename:'[name].js',
        publicPath:'http://localhost:8080/public',
    },
    module:{
        rules:[
            {
                test:/\.(png|jpg)$/,
                //如果图片小于8k  8192byte  就将图片Base64编码成字符串
                use:'url-loader?limit=8192&context=client&name=/img/[name].[ext]'
            },
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
            }


        ]
    },
    plugins:[
        new CleanWebpackPlugin(['public']),
        //用来独立css文件和路径的
        new ExtractTextPlugin({
            filename: function (getPath) {
                console.log(getPath('css/[name].css'));
                return getPath('css/[name].css').replace('css/common', 'css');
            },
            allChunks: true
        }),
        //把jquery的全局变量提取出来的插件(jQuery not undefined)
		new webpack.ProvidePlugin({
			$:'jquery',
			jQuery:'jquery'
        }),
        //混淆压缩
        new webpack.optimize.UglifyJsPlugin()
    ]


};


