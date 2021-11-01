// 在jQuery中 调用$.get() $.post() $.ajax()时 
// 都会在 后台调用一个函数
// 在这个函数中 可以拿到我们给Ajax提供的配置对象
// 传入的options实参中 保存着这次请求的一些数据
$.ajaxPrefilter(function (options) {
    //在发起真正的Ajax之前 统一拼接请求的根路径
    // 这样我们就可以 在自己写的js中 直接使用接口即可
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url
console.log( options.url);
})