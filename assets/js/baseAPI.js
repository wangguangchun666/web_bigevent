// 在jQuery中 调用$.get() $.post() $.ajax()时 
// 都会在 后台调用一个函数
// 在这个函数中 可以拿到我们给Ajax提供的配置对象
// 传入的options实参中 保存着这次请求的一些数据
$.ajaxPrefilter(function (options) {
    //在发起真正的Ajax之前 统一拼接请求的根路径
    // 这样我们就可以 在自己写的js中 直接使用接口即可
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 判断请求的接口是否需要权限
    if (options.url.indexOf('/my') !== -1) {
        //  统一为有权限的接口设置响应头
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }

    // 全局统一挂载 complete函数 无论请求成功与否 都会执行这个回调函数

    options.complete = function (res) {
        if (res.responseJSON.status != 0 && res.responseJSON.message === '身份认证失败！') {
            //清空本地存储的token
            layer.msg(`获取用户信息失败,请联系管理员`)
            localStorage.removeItem('token');
            location.href = '/login.html'
        }
    }

})