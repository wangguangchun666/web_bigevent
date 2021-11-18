$(function () {
    // 裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 动态获取文章类别
    initCate();
    // 获取layui提供的form
    var form = layui.form
    // 编辑功能 需要的本地存储的临时 id
    var id = sessionStorage.getItem('id');

    // 动态获取文章类别
    function initCate() {

        $.ajax({
            method: 'get',
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    layer.msg('获取文章类别失败')
                }
                // 渲染编辑功能
                edit();
                // 渲染动态获取的文章类别
                var htmlstr = template("select", res);
                $("[name=cate_id]").html(htmlstr);
                form.render();
            }
        })
    }
    // 定义编辑功能
    function edit() {
        // 如果本地存储的临时id存在
        if (id) {
            // 发起ajax请求
            $.ajax({
                method: 'get',
                url: "/my/article/" + id,
                success: function (res) {
                    console.log(res);
                    if (res.status != 0) {
                        sessionStorage.removeItem('id')
                        return layer.msg("请求数据失败")
                    }
                    layer.msg("请求成功")
                    // 快速填充数据 因为下拉框和 文本域都是第三方插件有包装 所以要在包装前生成原生DOM
                    form.val('art_details', res.data);
                    // 初始化富文本编辑器
                    initEditor()

                    // url转本地地址 自己是这样理解的
                    console.log(res.data.cover_img);

                    // 渲染图片成功
                    // console.log(URL.revokeObjectURL());
                    $image.cropper('destroy').attr('src', "http://api-breakingnews-web.itheima.net" + res.data.cover_img).cropper(options)
                }

            })
        } else {
            //如果本地id不存在  初始化富文本编辑器 
            initEditor()
        }
    }

    // 点击选择封面
    $(".btn-ChooseImage").on('click', function () {
        $("#files").click();

    })
    $("#files").change(function (e) {

        // 事件对象下的 target下的files是伪数组 里面就是存着用户所选中的文件
        if (e.target.files.length != 1) {
            return layer.msg("请选择图片")
        }
        //    拿到用户选择的图片
        var flies = e.target.files[0];

        // 将图片创建一个URL地址
        var newImgURL = URL.createObjectURL(flies)
        console.log(123);
        console.log(newImgURL);
        // 将新的url地址传入
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })


    // 定义文件的发布状态
    var art_state = '已发布';
    $("#draft").click(function () {
        art_state = "草稿";
    })

    $("#form_pub").submit(function (e) {
        e.preventDefault();
        //    将表单数据添加到formdata中
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存入
        fd.append("state", art_state)

        // 将裁剪后的图片，输出为文件 
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // blob就是转换成的文件
                console.log(blob);
                fd.append('cover_img', blob);
                // 发起Ajax请求 发布文章
                publishArticle(fd)
            })

    })

    function publishArticle(fd) {
        // $.ajax({
        //     method:'post',
        //     url:'/my/article/add',
        //     data:fd,
        //     // 如果提交的ForData格式的数据 必须添加下面两个属性
        //     contentType:false,//不修改content-Type的值 使用ForData的默认值
        //     processData:false,//不对ForData中的数据进行url编码 将数据原样发送到服务器
        //     success:function (res) {
        //         console.log(res);
        //     }
        // })
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = './atr_list.html'
            }
        })
    }
})