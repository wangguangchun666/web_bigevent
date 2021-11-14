window.onload = function () {
    // 定义表单校验规则

    var form = layui.form;
    form.verify({
        // 自定义一个叫 pwd 校验规则
        pwd: [/^[\S][a-zA-Z0-9]{6,10}$/, "密码必须包含大小写字母和数字的组合，不能使用空格，长度在 6-12 之间"],
        //比较新密码和旧密码
        NAOpwd: function () {
            if ($("#newPwd").val() === $("#oldPwd").val()) {
                return ("新密码和旧密码不能相同");
            }
        },
        // 比较新密码和确认密码
        repwd: function () {
            if ($("#newPwd").val() !== $("#confirm_pwd").val()) {
                return ("新密码和确认密码不相同");
            }
        }
    })

    // 提交数据
    $(".layui-form").submit(function (e) {
        e.preventDefault();

        // 使用layui的方法 第一个值是 表单的lay-filter="user_info" 所对应的值
        // 第二个值是所赋值的参数 是对象  不存在则是取值
        // console.log(form.val("user_pwd"));
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: form.val("user_pwd"),
            success: function (res) {
                if (res.status == 0) {
                    layer.msg(res.message);

                    // 不跳转页面的话可以重置表单数据 jQuery元素转换成DOM元素 调用表单的reset方法 重置表单数据
                    $(".layui-form")[0].reset();

                    // //清空本地存储的token
                    // localStorage.removeItem('token');
                    // location.href = '/login.html'
                } else {
                    return layer.msg(`修改密码失败,` + res.message)
                }
            }
        })
    })

}

// aAqwe1234