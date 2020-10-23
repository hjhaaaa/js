import request from '@/api/request/tk'



// 全局配置信息
export function allconfig(params) {
  return request.post('/userconfig/allconfig', params)
}

// 保存全局配置
export function saveAllconfig(params) {
  return request.post('/userconfig/config', params)
}

// 全局添加过滤条件
export function addfilter(params) {
  return request.post('/userconfig/addfilter', params)
}

// 全局删除过滤条件
export function deletefilter(params) {
  return request.post('/userconfig/deletefilter', params)
}

// 淘宝配置信息
export function taobaoconfig(params) {
  return request.post('/usertaobaoconfig/taobaoconfig', params)
}

// 保存淘宝配置信息
export function saveTaobaoconfig(params) {
  return request.post('/usertaobaoconfig/config', params)
}

// 拼多多配置信息
export function pddconfig(params) {
  return request.post('/userpddconfig/pddconfig', params)
}

// 保存拼多多配置信息
export function savePddconfig(params) {
  return request.post('/userpddconfig/config', params)
}
  
