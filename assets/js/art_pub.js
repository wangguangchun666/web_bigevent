$(function () {
    // 初始化富文本编辑器
    initEditor()
    // 动态获取文章类别
    initCate();
    // 获取layui提供的form
    var form = layui.form



    function initCate() {
        $.ajax({
            method: 'get',
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取文章类别失败')
                }
                var htmlstr = template("select", res);
                $("[name=cate_id]").html(htmlstr);
                form.render()
            }
        })
    }

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
      

        // $image
        //     .cropper('destroy') // 销毁旧的裁剪区域
        //     .attr('src', newImgURL) // 重新设置图片路径
        //     .cropper(options) // 重新初始化裁剪区域
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



    // 编辑功能
    // var id = sessionStorage.getItem('id');

    // if (id) {
    //     $.ajax({
    //         method: 'get',
    //         url: "/my/article/" + id,
    //         success: function (res) {
    //             if (res.status != 0) {
    //                 sessionStorage.removeItem('id')
    //                 return layer.msg("请求数据失败")
    //             }
    //             var data = res.data
    //             console.log(res.data);
    //             form.val('art_details', res.data)

    //             // form.render()
    //             // $("[name=title]").val(data.title)
    //             // var cate_idstr = "[lay-value=" + data.cate_id + "]"
    //             // console.log(cate_idstr);
    //             // $(cate_idstr).addClass('layui-this');
    //             // var hetlstr = `<option value="">请选择文章类别</option> <option value=${}></option>`
    //             //    console.log( $("cate_idstr"));
    //             //     form.render()
    //             // console.log(data.content);
    //             // $("#textarea").html(data.content)
    //             //    console.log( );
    //             // document.querySelector('#tinymce').value = data.content
    //             // form.render()
    //             //"100267955"
    //             // console.log($('option'));
         
    //         }

    //     })
    // }

})