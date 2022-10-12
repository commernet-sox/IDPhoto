//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  getAccessToken(){
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=ydEfViLlfBwhgudV5Rvgf4G2&client_secret=YQx7N090UjGtNNVljHHP7MQcgTq3Vruh',
      method:'POST',
      success(res){
        const data = JSON.parse(res.data)
        console.log(data)
        console.log(data.access_token)
        this.globalData.access_token=data.access_token;
      }
    })
  },
  globalData: {
    userInfo: null,
    base64Img:'',
    access_token:'24.f2ad6f7ad84e24170cf2d6fc59c8d8ba.2592000.1668144500.282335-27855478'
  }
})