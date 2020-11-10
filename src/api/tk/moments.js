import request from '@/api/request/tk'



// 获取淘客/拼多多发圈列表
export function sendSnsList(params) {
  return request.post('/SendSns/List', params)
}

// 获取淘宝详细信息
export function sendSnsTbItemDetail(params) {
  return request.post('/SendSns/TbItemDetail', params)
}

// 获取拼多多商品详细信息
export function sendSnsPddItemDetail(params) {
  return request.post('/SendSns/PddItemDetail', params)
}

// 发送朋友圈
export function sendSnsSendSns(params) {
  return request.post('/SendSns/SendSns', params)
}

// 淘客设置发圈是否使用模板
export function tKSetSendQunConfig(params) {
  return request.get('/SendSns/TKSetSendQunConfig', {params})
}

// 立即重新发送
export function sendNow(params) {
  return request.get('/SendSns/SendNow', {params})
}

// 重新排队发送
export function rewriteQueue(params) {
  return request.get('/SendSns/RewriteQueue', {params})
}

// 撤销发送
export function cancelQuan(params) {
  return request.get('/SendSns/CancelQuan', {params})
}