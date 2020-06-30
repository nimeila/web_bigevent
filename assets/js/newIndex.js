// 获取用户信息
getUserInfo();

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 获取用户信息成功则渲染头像
            renderAvatar(res.data);
        }
    })

}

function renderAvatar(user) {
    // 1、获取用户信息名称
    var name = user.nickname || user.username;
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}

var layer = layui.layer;
$('#btn-logout').on('click', function() {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
        //do something
        // 1. 清空本地存储中的 token
        localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
        location.href = '/login.html'

        // 关闭 confirm 询问框
        layer.close(index)
    })
})