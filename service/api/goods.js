import request from '../../common/js/request.js';
/**
 * 获取商品列表
 */
export const GetItemList = (data) => {
  return request({
    url: 'trinity-customer/item/device_list',
    method: 'post',
    data
  })
}

/**
 * 消费者操作
 */
export const CustomerAction = (data) => {
  return request({
    url: 'trinity-customer/customer/action',
    method: 'post',
    data
  })
}