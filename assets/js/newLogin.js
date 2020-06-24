$(function() {
    // ----------------  切换登录和注册的盒子 -----------------
    $('#btn-reg').click(function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    $('#btn-login').click(function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });



    // ------------------正则---------------------
    // layui里获取form对象

    var form = layui.form
    var layer = layui.layer;

    // 设置正则 
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var pwd = $('#reg_box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });






    // ------------------注册---------------------
    $('#reg_box').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault();
        var data = {
            username: $('#reg_box [name=username]').val(),
            password: $('#reg_box [name=password]').val()

        }
        $.post('http://ajax.frontend.itheima.net/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！');
            $('#btn-login').click();

        })

    })


    // -----------------登录-------------------------
    // 监听表单
    $('#login_box').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')

                }
                layer.msg('登录成功！')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'

            }
        })
    })


});