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
        'common/main':[srcPath+'/common/main.js'],
        'common/admin-lib':['jquery','bootstrap','BOOTSTRAP_CSS'] ,//public/common/admin-lib.js public/common/admin-lib.css
        'common/lib':['jquery','APP_CSS']
    },
    output:{
        path:__dirname+'/public',
        filename:'[name].js',
        publicPath:'http://localhost:8080/public/',
    },
    resolve:{
        modules:[srcPath,'node_modules'],//指定webpack查找文件目录
        //取别名，在自己的js里面直接使用这个别名
        alias: {
            SRC:srcPath ,
            BOOTSTRAP_CSS:'bootstrap/dist/css/bootstrap.css',
            BOOTSTRAP_TABLE_CSS:'bootstrap-table/dist/bootstrap-table.css',
            APP_CSS: 'SRC/common/app.less'
        }
    },
    module: {
        rules: [{
                test: /\.(png|jpg)$/,
                use: 'url-loader'
            },
            {
                test: /(\.css|\.less)$/,
                use: [
                    'style-loader',
                    'css-loader?sourceMap', //2
                    'less-loader' /**处理.less后缀的文件 */
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: [
                    'file-loader'
                ]
            },
            //先暂时性把这个加载器注释掉

            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime','syntax-dynamic-import']
                    }
                }
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin(['public'],{
            exclude:['ueditor']
        }),
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
        new webpack.optimize.UglifyJsPlugin(),//这个插件不支持混淆es6
        
    ]


};


