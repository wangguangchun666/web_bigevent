$(function () {
    //查询参数对象
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每一页显式几条
        cate_id: null, //	文章分类的 Id
        state: null //	文章的状态，可选值有：已发布、草稿
    }

    var form = layui.form;
    var laypage = layui.laypage;

    // 初始化文章列表
    getInitTabList();
    // 初始分类
    getInitCates();

    // 通过模板字符串 定义美化时间过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);
        // 获取年月日 时分秒
        var y = dt.getFullYear();
        var m = padzero(dt.getMonth());
        var d = padzero(dt.getDay());

        var hh = padzero(dt.getHours());
        var mm = padzero(dt.getMinutes());
        var ss = padzero(dt.getSeconds());
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss
    }
    // 补0函数
    function padzero(n) {
        return n > 9 ? n : "0" + n
    }

    // 文章列表
    function getInitTabList() {
        // 发起aj按下请求
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
            
                if (res.status != 0) {
                    return layer.msg("获取文章列表失败")
                }
                // 渲染到页面
                var htmlstr = template("tpl-tablelis", res);
               
                $('tbody').html(htmlstr);

                // 渲染分页  这里因为里面没数据所以自己加的
                renderPage(res.total);
            }
        })
    }

    //分类
    function getInitCates() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (res) {

                if (res.status != 0) {
                    return layer.msg('获取分类列表失败')
                }
                var htmlstr = template('select', res);

                $('[name=cate_id]').html(htmlstr)
                // 因为layui的渲染机制 导致动态生成的 options不能有效的渲染出出来 这里需要调用方法 重新渲染
                form.render()
            }
        })
    }

    // 筛选表单提交
    $("#form_seach").on('submit', function (e) {
        e.preventDefault();
        //  更改查询对象中的值
        q.cate_id = $("[name=cate_id]").val();
        q.state = $("[name=state]").val();
        getInitTabList()
    })

    //    定义渲染分页
    function renderPage(total) {


        //调用laypage渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器的id 注意不加#
            count: total, //数据总数，从服务端得到
            limits: [1, 2, 3, 4, 5],
            limit: q.pagesize, //一页显式几条
            curr: q.pagenum, //当前哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            // 页面切换时 触发jump回调  触发jump回调有两种方式  
            //1.手动点击页码 页面切换时
            //2.页面刷新 只要调用 laypage.render这个方法就会触发
            jump: function (obj, first) {
                // first类似于一个标记 当页面刷新时 调用 first的值为true
                //当手动调用时 false的值为undefined

                if (!first) {
                    // console.log(obj.curr); 当前的页码
                    // console.log(obj.limit);当前每一页的显式
                    // 把最新的数据更新到查询对象中
                    q.pagenum = obj.curr;
                    // 把手动更改的条目数上面的limits数组中的值 给pagesize 
                    q.pagesize = obj.limit;
                    // 刷新文章列表 不过不能这样写 因为会陷入死循环 
                    //这里调用了函数 但是函数中又调用了渲染页码 默认第一页 也会触发jump
                    getInitTabList();
                }
                // 刷新文章列表 不过不能这样写 因为会陷入死循环 
                //这里调用了函数 但是函数中又调用了渲染页码 默认第一页 也会触发jump
                // getInitTabList();
            }
        });
    };


    // 删除按钮
    $("tbody").on('click', '.del', function () {
        // 获取当前页面 还剩多少个删除按钮 
        var length = $(".del").length
        var id = $(this).attr("data-id")
        layer.confirm('确认删除', {
            icon: 3,
            title: '提示'
        }, function (index) {

            $.ajax({
                method: 'get',
                url: "/my/article/delete/" + id,
                success: function (res) {

                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功')

                    //当前页面的数据全部删除掉时 页码还在第四页 所以在下面渲染页面时 还是请求的第四页的数据
                    // 所以需要判断 是否还有剩余的数据
                    if (length == 1 && q.pagenum - 1 > 0) {
                        q.pagenum = q.pagenum - 1
                    }

                    // 刷新页面
                    getInitTabList()

                }
            })
            // 关闭弹窗
            layer.close(index);
        });
    })


    // 编辑按钮
    $("body").on('click','.redact',function () {
        // console.log($(this).attr("data-id"));
        var id = $(this).attr("data-id")
       sessionStorage.setItem('id',id)
        location.href = './art_edit.html'
//    console.log(123);
    })
})