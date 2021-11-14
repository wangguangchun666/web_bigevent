// jQuery入口函数
$(function () {
    
    // 获取用户的信息
    initUserInfo();
    submit()
    // 禁用表单的输入记录
    // $("input").prop("autocomplete","off");

    // 定义表单校验规则
    var form = layui.form
    form.verify({
        // 验证昵称
        nname: [/^\S{1,6}$/, "昵称长度必须在1-6位之间"],
        // 验证邮箱 layui有自带的
        // email:[/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,"输入的邮箱格式不正确"]
    })

    // 获取用户的信息
    function initUserInfo() {

        $.ajax({
            method: "get",
            url: "/my/userinfo",
            // 请求头在baseApi在设置了
            // 请求成功调用的函数
            success: function (res) {
                // console.log(res.data);
                if (res.status == 0) {
                    // $(".username").val(data.username);
                    // $("#nickname").val(data.nickname);
                    // $("#email").val(data.email);
                    // 使用layui的方法 第一个值是 表单的lay-filter="user_info" 所对应的值
                    // 第二个值是所赋值的参数 是对象  不存在则是取值
                    form.val('user_info', res.data)
                    reset(res.data);
                } else if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }
            }
            // complete函数 也在baseAPI中
        })
    }


    // 修改 重置按钮 
    function reset(data) {
        //单击重置的时候 恢复表单原有val而不是 清空
        $(".layui-btn-primary").click(function (e) {
            e.preventDefault();
            form.val('user_info', data)
        })
    }

    // 提交表单数据
    function submit() {
        $(".layui-form").on('submit', function (e) {
            e.preventDefault();
            // console.log(form.val('user_info'));//或获取到禁用的属性
            // console.log($(this).serialie());
            $.ajax({
                method: 'post',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status == 0) {
                        layer.msg("修改用户信息成功");
                        initUserInfo();
                        window.parent.getUserInfo();
                    } else {
                        return layer.msg("修改用户信息失败")
                    }
                }
            })
        })
    }


})