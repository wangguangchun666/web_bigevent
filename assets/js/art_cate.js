$(function () {

    getInitTables()


    // 初始化表单数据
    function getInitTables() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 传入的是res  循环的是data 输出的是其中的value
                var htmlstr = template("tpl-tablelis", res);
                document.querySelector("tbody").innerHTML = htmlstr
            }
        })
    }

    // 获取弹出层  弹出层会在 不同的触发事件 中刷新 两个弹出层 不会同事出现
    var index = null;

    // 添加功能
    $(".btnAdd").on('click', function () {

        index = layer.open({
            // 修改弹出框的属性 宽度
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#add_sort").html()
        });
    })

    // 绑定提交事件 提交添加的数据  因为这个dom是动态生成的 所以只能用事件委托
    $("body").on('submit', "#form_add", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('新增文章分类失败');
                }
                layer.msg('新增文章分类成功');
                // 关闭弹出层
                layer.close(index);
                // 刷新表单数据
                getInitTables();
            }
        })
    })
    // 获取layui的form对象
    var form = layui.form;

    // 编辑弹出层
    $("tbody").on('click', '.redact', function () {
        index = layer.open({
            // 修改弹出框的属性 宽度
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $("#change_sort").html()
        })
        var id = $(this).attr('data-id');

        // 通过id 获取对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 通过layui快速补充表单数据  lay-filter="change_sort"属性 并传入数据
                form.val('change_sort', res.data)
                // console.log(res);
            }
        })
    })

    // 提交编辑数据
    $("body").on("submit", '#form_change', function (e) {
        e.preventDefault()
        $.ajax({
            method: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {

                if (res.status != 0) {
                    return layer.msg("更新分类信息失败")
                }
                layer.msg('更新分类信息成功');
                // 关闭弹出层
                layer.close(index);
                // 刷新表单数据
                getInitTables();
            }
        })
    })

    // 删除按钮
    $("tbody").on('click', '.del', function () {
        var id = $(this).attr("data-id")
        layer.confirm('确认删除', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'get',
                url: "/my/article/deletecate/" + id,
                success: function (res) {

                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章成功')
                    // 刷新页面
                    getInitTables();
                    // 关闭弹窗
                    layer.close(index);
                }
            })

        });
    })
})