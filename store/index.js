export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: [],
    imgURL:[],
    buttonsSelect:0
  },
  //无脑全部更新，组件或页面不需要声明 use
  //updateAll: true,
  debug: true
}