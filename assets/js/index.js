$(function () {
    // ----------------获取用户信息，并渲染到页面中------------------------------
    gituserInfo();

    // -----------------退出功能---------------------------
    // 删除token
    // 页面跳转到页面
    $("#logout").click(function () {
        // 弹出层询问是否要退出
        layer.confirm('确定退出吗？叼毛', function (index) {
            // 如果点击了确定删除token，页面跳转
            localStorage.removeItem('token');
            location.href = '/login.html';
            // 关闭当前弹出层
            layer.close(index);
        });

    });

});
// 封装函数，完成获取用户信息，并渲染到页面
// 函数一定要放到入口函数外面。因为其他页面也要用
function gituserInfo() {
    $.ajax({

        url: 'http://www.liulongbin.top:3007/my/userinfo',
        success: function (res) {
            if (res.status === 0) {
                // 设置 欢迎语 （有昵称优先使用昵称，没有昵称 则使用账号）
                var name = res.data.nickname || res.data.username;
                $('.welcome').html('欢迎你&nbsp;&nbsp;' + name)
                // 设置头像 （有图片使用图片 没有图片使用首字母）
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-img').hide();
                } else {
                    $('.layui-nav-img').hide();
                    $('.text-img').css('display', 'inline-block').text(name.substr(0, 1).toUpperCase());
                }
            } else if (res.status === 1 && res.message === '身份认证失败！') {
                // 说明客户端使用了假的token 或者使用了过期的token
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        },
        // headers配置请求头
        headers: {
            Authorization: localStorage.getItem('token')
        }
    });
}