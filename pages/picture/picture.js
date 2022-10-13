// pages/picture/picture.js
const app = getApp()
Page({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        path: "",
        title: "",
        name: "",
        icon: "",
        px: "",
        loadModal: false,
        tips: "",
        width: 300,
        height: 400,
        colorList: [{
                id: 1,
                name: 'bg-gray',
                color: '#ffffff',
                isSelected: true,
            },
            {
                id: 2,
                name: 'bg-blue',
                color: '#3ca6f1',
                isSelected: false,
            },
            {
                id: 3,
                name: 'bg-red',
                color: '#e02852',
                isSelected: false,
            },
            {
                id: 4,
                name: 'bg-gradual-blue',
                color: '#71d5e2',
                isSelected: false,
            },
            {
                id: 5,
                name: 'bg-gradual-red',
                color: '#f9693e',
                isSelected: false,
            },
            {
                id: 6,
                name: 'bg-gradual-green',
                color: '#bbb9b8',
                isSelected: false,
            },
        ],
        oriSelect: 0,
        bgColor: '#ffffff',
        base64Img: '',
        imgSrc: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        // _this.createImage();

        // console.log("query:"+options.query)
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('acceptDataFromOpenedPage', {
            data: 'test'
        });
        eventChannel.emit('someEvent', {
            data: 'test'
        });
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.log(data)
            _this.setData({
                path: data.data,
                title: data.title,
                name: data.name,
                icon: data.icon,
                px: data.px,
                width: data.px.split(',')[0],
                height: data.px.split(',')[1],
                base64Img: data.data
            });
        })
        console.log(_this.data.width)
        //生成图片
        console.log("onLoad...")

    },
    //保存图片
    savePic(e) {
        var _this = this;
        if (_this.data.imgSrc == "") {
            wx.showToast({
                title: '图片生成失败。',
                icon: 'fail'
            })

        } else {
            _this.setData({
                tips: "保存中...",
                loadModal: true
            })
            wx.saveImageToPhotosAlbum({
                filePath: _this.data.imgSrc,
                success(res) {
                    _this.setData({
                        tips: "保存成功",
                    })
                    setTimeout(() => {
                        _this.setData({
                            loadModal: false
                        })
                    }, 1000)

                }
            })
        }
    },
    //返回上一页
    goBack(e) {
        wx.navigateBack({
            delta: 1,
        })
    },
    //选择底色重新生成图片
    checked(e) {
        console.log(e)
        var _this = this;
        let index = e.currentTarget.dataset.index
        let temp_str = 'colorList[' + index + '].isSelected';
        let ori_str = 'colorList[' + this.data.oriSelect + '].isSelected';
        console.log(index, temp_str);
        this.setData({
            [temp_str]: !this.data.colorList[index].isSelected,
            [ori_str]: !this.data.colorList[this.data.oriSelect].isSelected,
            oriSelect: index,
            bgColor: this.data.colorList[index].color,
        });
        console.log(this.data.colorList, this.data.bgColor)
        _this.createImage1();
    },
    createImage1(){
        var _this=this;
        const query = wx.createSelectorQuery()
        query.select('#canvas')
            .fields({
                node: true,
                size: true
            })
            .exec((res) => {
                const canvas = res[0].node
                
                //获取当前设备像素比
                const dpr = wx.getSystemInfoSync().pixelRatio
                console.log(res,dpr)
                canvas.width = res[0].width*dpr
                canvas.height = res[0].height*dpr
                const ctx = canvas.getContext('2d')
                ctx.scale(dpr, dpr)
                // ctx.fillRect(0, 0, 100, 100)
                ctx.fillStyle = _this.data.bgColor;
                ctx.setStrokeStyle = '#fff';
                ctx.setLineWidth = 0;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                var img = canvas.createImage();
                // img.src = '../../images/test1.jpg';
                img.src = 'data:image/png;base64,'+_this.data.base64Img
                img.onload=(e)=>{
                    ctx.drawImage(img, 0, 0, res[0].width, res[0].height);
                    wx.canvasToTempFilePath({
                        canvas:canvas,
                        // canvasId: 'canvas',
                        x: 0,
                        y: 0,
                        width: _this.data.width,
                        height: _this.data.height,
                        destWidth: _this.data.width,
                        destHeight: _this.data.height,
                        success(res) {
                            console.log("生成图片路径：" + res.tempFilePath)
                            _this.setData({
                                imgSrc: res.tempFilePath
                            })
                            wx.showToast({
                                title: '图片生成成功。',
                                icon: 'success'
                            })
                        },
                        fail(res) {
                            console.log(res)
                            wx.showToast({
                                title: '图片生成失败',
                                icon: 'fail'
                            })
                        }
                    }, _this);
                }
                });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log("onready...")
        this.createImage1();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})