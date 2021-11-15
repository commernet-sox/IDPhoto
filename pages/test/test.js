const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    console.log("1111")
    const query = wx.createSelectorQuery();//如果是在组件中，则改成 this.createSelectorQuery()
    query.select('#canvas').fields({
      node: true,
      rect: true
    }, res => {
      const canvas = res.node;
      const ctx = canvas.getContext('2d');
      canvas.width = 500;//本地图像的width
      canvas.height = 753;//本地图像的height
      this.render(canvas, ctx);
    }).exec()
  },
  render(canvas, ctx) {
    let that = this;
    let img = canvas.createImage();//canvas 2d 通过此函数创建一个图片对象
    img.onload = (e) => {
      console.log('img loaded')
      ctx.drawImage(img, 0, 0, 500, 753);
      // ctx.font = "28px sans-serif";
      // ctx.fillStyle = "rgba(0, 0, 0, 1)";
      // ctx.fillText("我是分享文字111111111", 0, 40);
      // ctx.fillStyle = "rgba(0, 0, 0, .5)";
      // ctx.fillText("我是分享文字222", 0, 80);
      wx.canvasToTempFilePath({
        canvas,
        width: 500,
        height: 753,
        destWidth:500,
        destHeight:753,
        success(res) {
          console.log(res.tempFilePath)
          that.setData({
            imgSrc:res.tempFilePath
          })
        }
      }, that)
    }
    img.onerror = (e) => {
      console.error('err:', e)
    }
    img.src = './share.jpg'
  },

})
