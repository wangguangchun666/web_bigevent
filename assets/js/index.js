window.onload = function () {
   // 禁用表单的输入记录
    $("input").prop("autocomplete","off");
    // 发起Ajax请求获取用户信息
    getUserInfo();

    // 退出功能
    document.querySelector("#exit").addEventListener('click', function () {
        layer.confirm('确定退出登录吗?', {
            icon: 3,
            //可以无限个按钮
            btn: ['确定', '取消']
        }, function (index, layero) {
            localStorage.removeItem('token');
            location.href = '/login.html'
        }, function (index) {
            //按钮【按钮二】的回调
        });
    })


    // 给每一个li添加 一个自定义的属性
    $(".left_dl a").each(function (index, dom) {
        $(this).attr('data-index', index)//123
    })
    $(".top_dl a").each(function (index, dom) {
        $(this).attr('data-index', index)//123
    })
    var left = $(".left_dl dd");
    var top = $(".top_dl dd");
    // 给几个ul绑定单击事件
    $(".left_dl,.top_dl").on('click', 'a', function (e) {
        var index = $(e.target).attr("data-index");//获取到当前点击的a 的自定义属性
        // 因为dl中包含的a 通过jQuery获取的是伪数组 下标也是123 当前的添加类 其他兄弟移除类
        $(top[index]).addClass("layui-this").siblings().removeClass('layui-this');
        $(left[index]).addClass("layui-this").siblings().removeClass('layui-this');
    })


}
// 获取用户信息
function getUserInfo() {
    var xhr = new XMLHttpRequest();
    var data = {
        method: "get",
        url: "/my/userinfo",
        success: function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                if (res.status == 0) {
                    // 正常登录
                    // 渲染用户信息

                    render_info(res.data);
                } else if (res.status != 0) {
                    // 非法登录
                    //清空本地存储的token
                    layer.msg(`获取用户信息失败,请联系管理员`)
                    localStorage.removeItem('token');
                    location.href = '/login.html'
                }
            }
        }
    }
    if (data.method.toUpperCase() == "GET") {
        xhr.open('get', "http://api-breakingnews-web.itheima.net" + data.url);
        // 设置请求头  判断是否需要设置请求头
        /^\/my/.test(data.url) ?
            xhr.setRequestHeader("Authorization", localStorage.getItem('token') || "") : false;
        // 调用send函数 发起Ajax请求
        xhr.send();
        xhr.onreadystatechange = data.success;
    }

}
// 渲染用户信息
function render_info(data) {
    $('iframe').show();
    var welcome = document.querySelector('.welcom'); //欢迎xxx
    var text_image = document.querySelectorAll(".text-image"); //文字头像
    var img = $(".layui-nav-img");

    // 欢迎xxx
    data.nickname ? welcome.innerText = `欢迎  ${data.nickname}` : welcome.innerText = `欢迎${data.username}`;

    // 判断显示头像
    // 图片头像不存在
    if (!data.user_pic) {
        // 图片隐藏 ,修改文字头像,并显示
        // img.css('display', 'none')

        img.hide();
        // str[0] 也可以选中第一个
        var name = data.nickname || data.username;

        $(text_image).text(`${name}`.substr(0, 1).toUpperCase()).show()

    } else {
        //图片头像存在 隐藏文字头像
        $(text_image).hide();
        // 修改图片头像的src属性 并显示
        img.prop('src', data.user_pic).show
    }
}