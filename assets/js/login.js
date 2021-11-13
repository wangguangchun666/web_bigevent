// 登录注册页面切换
$(function () {

    // 点击去注册
    $('#to_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();

    })

    // 点击去登录
    $('#to_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })
})


// 自定义表单校验规则
// 从layUI中获取form对象
var form = layui.form
// 通过from.verify()函数定义校验规则
// layui中自定义的校验规则 HTML属性上加上校验规则即可
form.verify({

    // 自定义一个叫 pwd 校验规则
    pwd: [/^[\S][a-zA-Z0-9]{6,10}$/, "密码必须包含大小写字母和数字的组合，不能使用空格，长度在 6-12 之间"],

    // 用户名的验证
    usn: [/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, "字母开头，允许5-16字节，允许字母数字下划线"],

    // 验证两次密码   校验规则也可以是函数 
    // value 拿到的是使用校验规则的 密码框中的value值
    repwd: function (value) {
        // 通过形参拿到 确认密码框中的value

        // 拿到密码框中的内容
        var pwd = $('.reg-box .password').val();

        // 进行一次判断
        if (pwd != value) {

            // 如果判断失败，返回return消息
            return ("两次密码输入不一致，请重新输入");
        }
    }
})

// 获取layer对象
var layer = layui.layer
// 监听注册表单事件
$('#form_reg').on('submit', function (e) {
    // console.log("提交了");
    // 阻止表单默认提交行为
    e.preventDefault();

    // 通过Ajax发起请求
    var data = {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg .password').val()
    }
    $.post('/api/reguser', data, function (res) {
        if (res.status != 0) {
            return layer.msg(res.message);
        }
        layer.msg('注册成功');
        $('#form_reg input').val("");
        $('#to_login').click();
    })

})


//监听登录表单事件
// $('#form_login').on('submit',function (e) {
$('#form_login').submit(function (e) {
    //阻止默认提交行为
    e.preventDefault();
    // 发起Ajax请求 
    $.ajax({
        url: '/api/login',
        method: 'post',
        // jquery中方法serialize（）可以快速获取表单中的数据
        data: $(this).serialize(),
        success: function (res) {
            if (res.status != 0) {
                return layer.msg('登录失败用户名或密码错误')
            }
            layer.msg('登录成功')
            // 将登录成功的token 保存到本地
            localStorage.setItem("token",res.token)
            

            // 跳转页面
            location.href = '/index.html';  
        }
       
    })
})

// baa1234567
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDE2NDUsInVzZXJuYW1lIjoiYmFhMTIzNDU2NyIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIiLCJlbWFpbCI6IiIsInVzZXJfcGljIjoiIiwiaWF0IjoxNjM1NzUwNzU2LCJleHAiOjE2MzU3ODY3NTZ9.u10EKXGYTw7m6n3E4MunkEW5ZIMcTIazK1cjrZz_04w