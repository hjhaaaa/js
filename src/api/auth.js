import request from '@/utils/request'

// 登录
export function login(params) {
  return request.post('/d/adlogin', params)
}
// 登出
export function logout() {
  return request.get('/d/aduser/loginout')
}

export function modifyPassword(params) {
  return request.post('/modifyPassword', params)
}

// 淘客全盘数据列表
export function tkQuanpanList(params) {
  return request.post('/d/tkheaddata/tkqplist', params)
}
// 淘客月全盘数据列表
export function tkqpmonthlist(params) {
  return request.get('/d/tkheaddata/tkqpmonthlist', { params })
}
// 修改备注
export function tkQpEditremark(params) {
  return request.get('/d/tkheaddata/editremark', { params })
}
// 淘客指派
export function tkQpZhipai(params) {
  return request.post('/d/tkheaddata/sethead', params)
}
// 淘客详情数据
export function tkQpDetail(params) {
  return request.get('/d/tkheaddata/tkdatadetail', { params })
}

// 淘客数据报表列表
export function tkReportList(params) {
  return request.post('/d/tkheaddata/tkdatareport', params)
}
// 获取指派人列表
export function getHeadList(params) {
  return request.get('/d/tkheaddata/headlist', { params })
}
// 获取指派人列表
export function getSrqjList(params) {
  return request.get('/d/tkheaddata/ranktypelist', { params })
}

// 导出淘客全盘数据
export function tkQpDaochu(params) {
  return request.get('/d/tkheaddata/tkdatareportexport', { params })
}

// 获取群组列表
export function grouplist(params) {
  return request.get('/d/tkheaddata/grouplist', { params })
}

// 群组新增修改
export function editgroup(params) {
  return request.get('/d/tkheaddata/editgroup', { params })
}

// 导入
export function tkImport(params) {
  return request.post('/d/tkheaddata/import', params)
}


// 美逛拉新数据查询
export function mgdaylxlist(params) {
  return request.get('/d/mgdaylx/mgdaylxlist', { params })
}

// 美逛自购数据查询
export function mgdayzglist(params) {
  return request.get('/d/mgdayzg/mgdayzglist', { params })
}

// 美逛自购报表
export function mgzgmonthinfo(params) {
  return request.get('/d/mgdayzg/mgzgmonthinfo', { params })
}

// 修改自购备注
export function zgEditRemark(params) {
  return request.post('/d/mgdayzg/setremark', params)
}

// 美逛CPS数据列表
export function mgCpsList(params) {
  return request.post('/d/cps/list', params)
}

// 美逛CPS订单类型下拉
export function cpsdropdownlist(params) {
  return request.get('/d/cps/dropdownlist', { params })
}

// 美逛新人免单数据列表
export function mgdaylxfeelist(params) {
  return request.get('/d/fee/mgdaylxfeelist', { params })
}


// 金币大盘统计
export function coinCountList(params) {
  return request.get('/d/apptask/apptaskstatistics', { params })
}

export function shoufadanDataCount(params) {
  return request.post('/d/bs/bsdaydatalist', params)
}

// 全民免单数据列表
export function mgfreedaydatalist (params) {
  return request.get('/d/mgfree/mgfreedaydatalist', { params })
}
//获取菜单 
export function getuserrouter(params) {
  return request.get('/d/menu', params)
}

//用户信息列表
export function UsersList(params) {
  return request.get('/d/user/getlist', { params })
}
//创建用户
export function CreatUser(params) {
  return request.post('/d/user/AddOrUpdate', params)
}
//获取菜单
export function GetMenu(params) {
  return request.get('/d/menu/UserMenuRelation', { params })
}
//设置菜单
export function SetMenu(params) {
  return request.post('/d/menu/EditPermission', params)
}

// 组团任务统计
export function getcpadetail(params) {
  return request.get('/d/bs/getcpadetail', { params })
}
