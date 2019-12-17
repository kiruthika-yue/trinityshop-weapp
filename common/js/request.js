import { baseURL, timeout } from './config.js'

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      timeout: timeout,
      data: options.data,
      success: function (res) {
        resolve(res.data)
      },
      fail: reject
    })
  })
}

export default request;