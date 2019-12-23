
var app = getApp();
 
// const rootApi = 'https://xxx/index.php/sg/';//测试环境
const rootApi = 'https://xxx/index.php/sg/';//线上环境
// 微信自定义格式化时间方法，传入new Date()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
 
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 时间格式化为 时 分 秒(传入时间为毫秒)
 */
function MillisecondToDate(msd) {
  var time = parseFloat(msd) / 1000;
  if (null != time && "" != time) {
    if (time > 60 && time < 60 * 60) {
      time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
        parseInt(time / 60.0)) * 60) + "秒";
    }
    else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) + "分钟" +
        parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
          parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
    }
    else {
      time = parseInt(time) + "秒";
    }
  }
  return time;
}
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function zformatTime(number, format) {
 
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
 
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
 
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
 
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
 
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// post请求
function requestData(url, data0, successCallback, errorCallback) {
  wx.request({
    url: rootApi+url,
    data: data0,
    method: "POST",
    success: function (res) {
      successCallback(res);
    },
    error: function (res) {
      errorCallback(res);
    },
  });
}
 
// get请求
function getRequestData(url, data0, successCallback, errorCallback) {
  wx.request({
    url: rootApi+url,
    data: data0,
    method: "GET",
    success: function (res) {
      successCallback(res);
    },
    error: function (res) {
      errorCallback(res);
    },
  });
}
 
// 授权登录
function login(data0, successCallback, errorCallback) {
  requestData('Login/check', data0, successCallback, errorCallback);
}
 
// 用户登陆过期重新登录
function checkLogin() {
  wx.login({
    success: res => {
      const code = res.code;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log(res);
                // 可以将 res 发送给后台解码出 
                this.userInfo = res.userInfo;
                var iv = res.iv;
                var encryptedData = res.encryptedData;
                var postData = {};
                postData.code = code;
                postData.iv = res.iv;
                postData.encryptedData = res.encryptedData;
                //后台服务器授权登录接口
                this.login(postData,
                  (res) => {
                    console.log("login----")
                    if (res.data.code == 1) {//获取成功 
                      console.log("检测登陆过期后再次登录成功！");
                      var utoken = res.data.utoken;
                      // 先移除可能需要更改的storage
                      // wx.removeStorageSync('utoken');
                      //设置本地缓存
                      wx.setStorage({
                        key: 'utoken',
                        data: utoken,
                      });
                      //用户已经授权过
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    }
                    else {
                      wx.showModal({
                        title: '温馨提示',
                        content: res.data.msg
                      })
                    }
                  }
                )
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
    }
  })
}
 
// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
 
// 提示错误信息  
function isError(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  })
}
 
// 清空错误信息  
function clearError(that) {
  that.setData({
    showTopTips: false,
    errorMsg: ""
  })
}
//判断字符串中是否含有表情符号
function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
}  
 
module.exports = {
  formatTime: formatTime,
  zformatTime: zformatTime,
  requestData: requestData,
  trim: trim,
  isError: isError,
  clearError: clearError,
  getRequestData: getRequestData,
  checkLogin: checkLogin,
  login:login,
  // formatDuring:formatDuring,
  MillisecondToDate: MillisecondToDate,
  isEmojiCharacter: isEmojiCharacter
}