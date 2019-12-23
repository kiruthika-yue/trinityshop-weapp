import create from '../../utils/create'
import store from '../../store/index'
import { GetItemList, BannerPic } from '../../service/api/goods.js'

//获取应用实例
const app = getApp()

create.Page(store, {
  data:{
    duration:"",
    imgUrls:[
      {url:"../../assets/images/alipay.png"},
      {url: "../../assets/images/wechat.png"},
      {url: "../../assets/images/user.png"}
    ]
  },
  use: [
    'motto',
    'userInfo',
    'hasUserInfo',
    'canIUse',
    'newProp'
  ],
  computed: {
    reverseMotto() {
      return this.motto.split('').reverse().join('')
    }
  },
  //事件处理函数
  switchList: function (n) {
    console.log(n)
    this.setData({
      buttonsSelect: n
    })

  },
  onLoad: function () {
    

    // 测试接口调用
    // GetItemList({}).then(res=> {
    //   console.log(res)
    // })
    BannerPic({ "device_num":"jhceshi001"}).then(res => {
      console.log("res:",res)
      var imgInfo = res.data;
      var picsPath = imgInfo.pics;
      
      console.log("picsPath", picsPath)
      this.setData({
        duration: imgInfo.duration,
        // imgUrls: imgInfo.pics
      })
    })
    
    if (app.globalData.userInfo) {
      this.store.data.userInfo = app.globalData.userInfo
      this.store.data.hasUserInfo = true

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.store.data.userInfo = res.userInfo
        this.store.data.hasUserInfo = true
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.data.userInfo = res.userInfo
          this.store.data.hasUserInfo = true
        }
      })
    }
  },
  getUserInfo: function (e) {
    this.store.data.userInfo = e.detail.userInfo
    this.store.data.hasUserInfo = true
  }
})
