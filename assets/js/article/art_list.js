$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个查询对象
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }

    initArtList();
    // 初始化文章列表
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                template.defaults.imports.dataFormat = function(date) {
                    var time = date.replace(/-/g, ':').replace(' ', ':');
                    time = time.split(':');
                    var dt = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
                    var y = dt.getFullYear();
                    var m = padZero(dt.getMonth() + 1)
                    var d = padZero(dt.getDate())
                    var hh = padZero(dt.getHours())
                    var mm = padZero(dt.getMinutes())
                    var ss = padZero(dt.getSeconds())
                    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
                }
                var htmlTpl = template('tpl-table', res);
                $('tbody').html(htmlTpl);
                renderPage(res.total)
            }

        })
    }

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }



    // 渲染select下拉
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                };
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        console.log(cate_id)
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initArtList()
    });


    // 渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initArtList();
                }
            }
        })
    }
    $('body').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-Id')
        location.href = './art-edit.html'
        console.log(id)
            // $.ajax({
            //     url: '/my/article/' + id,
            //     success: function(res) {
            //         console.log(res);
            //         if (res.status === 0) {
            //             form.val('edit-form', res.data); // 标题、内容
            //             // console.log(res.data);

        //             // 销毁剪裁区，更换图片，重新创建剪裁区
        //             $image.cropper('destroy').attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img).cropper(options);

        //         }
        //     }
        // })


    })


    // delete功能
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).data('id');
        var len = $('.btn-delete').length;
        layer.confirm('确认删除吗？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        if (len === 1) {
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initArtList();
                    }
                }
            });
            layer.close(index);
        })
    })
})