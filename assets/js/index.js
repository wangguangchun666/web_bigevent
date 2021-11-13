window.onload = function () {

    // 发起Ajax请求获取用户信息
    // getUserInfo();
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
                    disabled()
                }
            }
        }
    }
    getAjax(xhr, data);

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

}



// 自己封装的Ajax函数 就不用一直设置请求头了
function getAjax(xhr, data) {
    // console.log(data.method.toUpperCase() == "GET");
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
    $('iframe').prop('src', "./home/dashboard.html")
    var welcome = document.querySelector('.welcom'); //欢迎xxx
    var text_image = document.querySelectorAll(".text-image"); //文字头像
    var img = $(".layui-nav-img");

    // 欢迎xxx
    data.nickname ? welcome.innerText = `欢迎${data.nickname}` : welcome.innerText = `欢迎${data.username}`;

    // 判断显示头像
    // 图片头像不存在
    if (!data.user_pic) {
        // 图片隐藏 ,修改文字头像,并显示
        // img.css('display', 'none')
        img.hide();
        // str[0] 也可以选中第一个
        $(text_image).text(`${data.username}`.substr(0, 1).toUpperCase()).show()
        // 下面是原生js
        // text_image.forEach((value) => {
        //     value.innerText = `${data.username}`.substr(0, 1).toUpperCase();
        // });
    } else {
        //图片头像存在 隐藏文字头像
        $(text_image).hide();
        // 修改图片头像的src属性 并显示
        img.prop('src', data.user_pic).show
    }
}

// 非法登录禁止操作
function disabled() {
    // 禁用页面的click事件
    document.addEventListener("click", function handler(e) {
        e.stopPropagation();
        e.preventDefault();
    }, true);
    var time = 5;
    //清空本地存储的token
    localStorage.removeItem('token');
    setInterval(function () {
        (time == 0) ? location.href = '/login.html':
            layer.msg(`获取用户信息失败,请联系管理员,页面将在${time--}秒后跳转`)
    }, 1000)
}

// 获取用户信息
// function getUserInfo() {
//     // 创建xhr对象
//     var xhr = new XMLHttpRequest();
//     // 调用open函数
//     xhr.open('get', "http://api-breakingnews-web.itheima.net/my/userinfo");
//     // 设置请求头 需要在open之后 send之前  原生js要只设置一次请求头 可能要封装函数
//     xhr.setRequestHeader("Authorization", localStorage.getItem('token') || "")
//     // 调用send函数 发起Ajax请求
//     xhr.send();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//             var res = JSON.parse(xhr.responseText)
//             // console.log(res);
//             // console.log(res.data);

//             if (res.status != 0) {
//                 // 非法登录
//                 disabled()
//             } else {
//                 // 正常登录
//                 // 渲染用户信息
//                 render_info(res.data);
//             }
//         }
//     }

// }







//利用jQuer发起的请求 
// function getUser() {
//     $.ajax({
//         method: 'GET',
//         url: '/my/userinfo',
//         // 设置请求头
//         headers: {
//             Authorization: localStorage.getItem('token') || ""
//         },
//         success: function (res) {
//             console.log(res);
//         }

//     })
// }