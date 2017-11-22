
//实现：访问login  就自动帮我引入login.js
//按需加载
let modelPath=$('[data-main]').data('main');//login/login
console.log(modelPath)
if(modelPath){
   //异步引入模块
   import('../'+modelPath)
   .then(model=>{
       console.log('加载模块成功',model);
   }).catch(err=>{
       console.log('模块加载失败',err);
   })
};
//不是后台界面或者登陆界面
if(!location.pathname.startsWith('/admin')&&!location.pathname.startsWith('/login')){
   require('jquery-pjax');
   $(document).pjax('a.pjax','#main');
}
