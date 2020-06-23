// 其他各个页面都要引入的js文件
// common.js项目统一的配置文件

//判断token是否存在 如果不存在就跳转到登录页
if (!localStorage.getItem('token')) {
    location.href = "./login.html";
}