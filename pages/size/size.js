//index.js
//获取应用实例
const app = getApp()
// 引入js文件
const FormData = require('../../utils/formData.js')
Page({
  options: {
    addGlobalClass: true,
  },
  data: {
    DotStyle: true,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
    TabCur: 0,
    scrollLeft: 0,
    title: "",
    name: "",
    icon: "",
    px: "",
    loadModal: false,
    tips: '加载中...',
    isSuccess:true,
  },
  //事件处理函数
  selectPic(e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        _this.formatKS(tempFilePaths);
        // _this.toPicture(tempFilePaths)
      }
    })
  },
  cameraPic(e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        _this.formatKS(tempFilePaths);
      }
    })
  },

  onLoad: function (options) {
    var _this = this;
    this.setData({
      title: options.title,
      name: options.name,
      icon: options.icon,
      px: options.px
    });
    console.log(_this.data.title)


  },
  toPicture(path) {
    var _this = this;
    console.log("toPicture...")
    wx.navigateTo({
      url: '../picture/picture',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: path,
          title: _this.data.title,
          name: _this.data.name,
          icon: _this.data.icon,
          px: _this.data.px
        })
      }
    })
  },
  formatKS(path) {
    var _this = this;
    _this.setData({
      tips: "加载中...",
      loadModal: true
    })
    // var img=wx.getFileSystemManager().readFileSync(path[0]);
    // console.log("img="+img);
    console.log(app.globalData.base64Img)
    wx.uploadFile({
      url: 'https://api-cn.faceplusplus.com/humanbodypp/v2/segment', //仅为示例，非真实的接口地址
      filePath: path[0],
      name: 'image_file',
      formData: {
        'api_key': '9WxFJI59MhhsgOE1rq4iJjojqYvSyqXS',
        'api_secret': 'SCdI-NPKYiCauuP8YGOC78xNJ7MXrc8P',
        'return_grayscale': 0,
      },
      success(res) {
        const data = JSON.parse(res.data)
        if(data.error_message!=undefined && data.error_message!="")
        {
          _this.setData({
            isSuccess:false,
          })
          wx.showToast({
            title: '图片抠图失败。',
          })
        }
        else
        {
          _this.setData({
            isSuccess:true,
          })
        }
        console.log(data)
        console.log(data.body_image)
        app.globalData.base64Img = data.body_image;
        console.log(app.globalData.base64Img)
        //do something
      },
      complete(res) {
        _this.setData({
          loadModal: false
        })
        if(_this.data.isSuccess)
        {
          _this.toPicture(path)
        }

      }
    })
  },
})