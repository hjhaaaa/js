import request from '@/api/request/dl'


// 获取代理工位列表
export function agentList(params) {
  return request.get('/Workstation/AgentList', {params})
}

// 获取发送群列表
export function sendGroupList(params) {
  return request.post('/SendGroup/List', params)
}

// 修改发单群备注
export function editRemark(params) {
  return request({
    url: '/SendGroup/EditRemark',
    method: 'post',
    params
  })
}

// 修改发单群状态
export function editStatus(params) {
  return request({
    url: '/SendGroup/EditStatus',
    method: 'post',
    params
  })
}

// 删除发单群
export function sendGroupDelete(params) {
  return request({
    url: '/SendGroup/Delete',
    method: 'post',
    params
  })
}

// 修改工位发圈状态
export function updateSendQuan(params) {
  return request({
    url: '/Workstation/UpdateSendQuan',
    method: 'post',
    params
  })
}

// 推送登录
export function wechatPushLogin(params) {
  return request.get('/Wechat/PushLogin', {params})
}

// 二维码登录
export function wechatQRLogin(params) {
  return request.get('/Wechat/QRLogin', {params})
}

// 退出登录
export function wechatLogout(params) {
  return request.get('/Wechat/Logout', {params})
}

// 查询登录状态
export function wechatLoginStatus(params) {
  return request.get('/Wechat/LoginStatus', {params})
}

// 代理账户登录
export function dlLogin(params) {
  return request.post('/UserLogin/Proxy', params)
}

// 群管号群列表
export function getGroupMana(params) {
  return request.get('/FansProxyPort/GetGroupMana', {params})
}

// 设置群管号开关
export function setGroupMana(params) {
  return request.get('/FansProxyPort/SetGroupMana', {params})
}

// 获取承接粉丝号
export function getAcceptFans(params) {
  return request.get('/FansProxyPort/GetAcceptFans', {params})
}

// 设置承接粉丝开关
export function setAcceptFans(params) {
  return request.get('/FansProxyPort/SetAcceptFans', {params})
}



