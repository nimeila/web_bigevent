$(function () {
    // ----------------  切换登录和注册的盒子 -----------------
    $('.goto-register').click(function () {
        $('#register').show().prev().hide();
    });

    $('.goto-login').click(function () {
        $('#register').hide().prev().show();
    });

    // ----------------  注册功能  --------------------------
    // 监听注册表单的提交事件
    $('#register form').on('submit', function (e) {

        // 阻止默认行为（阻止表单提交的行为）
        e.preventDefault();
        // 使用JS收集表单中的数据(获取输入框中的账号和密码)
        /**
             * serialize 是根据表单项的name属性值获取值的，所以这里一定要检查表单项的name属性
             */
        var data = $(this).serialize();
        // console.log(data); // username=admin&password=123
        // 把账号和密码提交给接口，从而完成注册
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/api/reguser',
            data: data,
            success: function (res) {
                // 无论成功还是失败，都要提示
                // alert(res.message);
                // leyui提供提示框
                layer.msg(res.message);
                // 并且隐藏注册的盒子，显示登录的盒子
                if (res.status === 0) {
                    $('#register').hide().prev().show();
                }
            }
        });

    });

    // -----------------------------完成表单验证-----------------------
    var form = layui.form;
    // 调用form.verify() 方法，自定义验证规则
    form.verify({
        // len:[正则表达式, 错误提示]
        len: [/^\w{6,12}$/, '密码长度必须是6-12位'],
        same: function (value) {
            //形参 value 表示使用验证规则的值
            // return '错误提示';
            // 获取密码框的值
            var password = $("#reg-password").val();
            // 比较
            if (password !== value) {
                return '两次密码不一致-JFJ提示'
            }
        }
    })

    // ----------------------------完成登录功能-------------------------
    // 监听登录表单提交事件
    $("#login form").on("submit", function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 获取账号和密码

        // ajax提交给接口
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 登录成功或失败都要提示
                // alert(res.message);
                // leyui提供提示框
                layer.msg(res.message);
                // 登录成功后跳转到index.html页面
                if (res.status === 0) {
                    // 登录成功先保存token
                    localStorage.setItem('token', res.token);
                    // location是BOM对象 直接可以使用  功能是页面跳转
                    location.href = "/index.html"
                }

            }
        })
    })


});
