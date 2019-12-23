App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权")
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              //调用登录
              this.AnginLogin()
              wx.switchTab({
                url: '/pages/toast/toast',
              })
            }
          })
        }
      }
    })
  },
  // 登录
  AnginLogin() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'http://fa.com/api/schoolreserve/login',
            data: {
              code: res.code,
              user_info: this.globalData.userInfo
            },
            success: function (res) {
              console.log('回调成功')
              wx.setStorageSync('token', res.data.data.token)
              wx.setStorageSync('user_id', res.data.data.user_id)
            },
            complete: function () {
              wx.checkSession({
                success() {
                  console.log('经过验证，登录有效')
                  // session_key 未过期，并且在本生命周期一直有效
                },
                fail() {
                  console.log('session过期，请重新登录')
                  // session_key 已经失效，需要重新执行登录流程
                  wx.switchTab({
                    url: '/pages/authorize/authorize',
                  })
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }

      }
    })
  },
  globalData: {
    userInfo: null
  }
})