window.onload = function () {
   // 禁用表单的输入记录
   $("input").prop("autocomplete","off");
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比  1/1
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //  点击上传模拟 用户点击file
    $("#select").on("click", function () {
        $("#file").click();
    })

    // 当用户选择了图片 file就会出发change事件
    $("#file").change(function (e) {
        // 事件对象下的 target下的files是伪数组 里面就是存着用户所选中的文件
        if (e.target.files.length != 1) {
            return layer.msg("请选择照片")
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        // $image
        //     .cropper('destroy') // 销毁旧的裁剪区域
        //     .attr('src', newImgURL) // 重新设置图片路径
        //     .cropper(options) // 重新初始化裁剪区域

        $image.cropper('destroy').attr('src', newImgURL).cropper(options)


    })
    //为确定按钮 绑定单击事件
    $("#btnUpload").click(function () {
        // 拿到用户裁剪过后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口 把头像上传到服务器
        $.ajax({
            method: "post",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('更新头像失败');
                }
                layer.msg("更新头像成功");
                window.parent.getUserInfo();

            }
        })
    })
}