import request from '@/utils/request'


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
  return request.post('/SendGroup/EditRemark', params)
}

// 修改发单群状态
export function editStatus(params) {
  return request.post('/SendGroup/EditStatus', params)
}

// 删除发单群
export function sendGroupDelete(params) {
  return request.post('/SendGroup/Delete', params)
}

// 修改工位发圈状态
export function updateSendQuan(params) {
  return request.post('/Workstation/UpdateSendQuan', params)
}


