const express=require('express');
const router=express.Router();


//引入操作数据库的模型对象
let User = require('../dbModels/User');

//后端响应给前端的数据格式
let responseMesg;

//在进入下面的路由之前，先调用中间件处理下
//该中间件在api。js里，所以只拦截api。js里面的路由
router.use((req, resp, next) => {
    console.log('中间件进来了');
    //初始化一下数据格式
    responseMesg = {
        success: false,
        message: ''
    };
    //放行;注意：如果不放行的话，请求就会被堵塞在中间件，进入不到下面的路由
    next();
});
router.post('/register', (req, resp, next) => {
    let parms = req.body;
    //首先判断前端传的参数是否正确(后端必须做参数的正确性校验，考虑最坏的情况)
    if (!parms.username || !parms.password) {
        //返回给前端一个错误消息

        responseMesg.message = '用户名或密码不能为空！'
        resp.json(responseMesg);
        return;
    }

    //在注册之前，我们得去查一下数据库，看一下用户名是否已经被
    //别人注册了；如果被别人注册了，就返回错误提示
    //如果没有，才进行注册操作


    //查询数据库
    //查询一条数据，如果根据条件查询出来的数据有多条
    //那么只取其中第一条
    User.findOne({
        username: parms.username
    }, (error, user) => {
        if (user) {
            //如果查出来了，就说明已经被注册了
            responseMesg.message = '用户名已经被别人注册了！';
            resp.json(responseMesg);
        } else {
            //没有被查出来，说明数据库里没有这个用户名
            new User({
                username: parms.username,
                password: parms.password
            }).save(function (error, user) {
                if (user) {
                    //注册成功

                    responseMesg.success = true;
                    responseMesg.message = '注册成功！';
                    resp.json(responseMesg);
                }
            });
        }
    })


});

/**
 * 校验用户民和密码
 */
router.post('/user/check',(request,response,next)=>{
    let parms = request.body;
    //首先判断前端传的参数是否正确(后端必须做参数的正确性校验，考虑最坏的情况)
    if (!parms.username || !parms.password) {
        //返回给前端一个错误消息
        responseMesg.message = '用户名或密码不能为空！'
        response.json(responseMesg);
        return;
    }

    //Promise写法   实现链式写法
    User.findOne({
        username: parms.username,
        password: parms.password
    })
    .then((user) => {
        console.log('查询结果');
        if (user) {
            responseMesg.success = true;
            responseMesg.message = '登陆成功';
            //登陆成功后往session里面存东西
            //把数据库查出来的这个user 作为标识存到session的user属性上
            request.session.user=user;
            response.json(responseMesg);
        } else {
            responseMesg.message = '用户名或者密码不正确！'
            response.json(responseMesg);

        }
    })
});




module.exports=router;