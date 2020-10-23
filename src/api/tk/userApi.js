import request from '@/api/request/tk'
//用户列表
export function UserList(params) {
    return request.post('/user/list', params)
}
//创建代理
export function CreatUser(params) {
    return request.post('/user/create', params)
}
//修改用户状态
export function UpdateUserStatus(id, status) {
    return request.post('/user/EditStatus', { Id: id, status: status })
}
//修改用户信息
export function UpdateUserRemark(id, remark) {
    return request.post('/user/EditRemark', { Id: id, remark: remark })
}
//获取登录用户信息
export function GetLoginUserInfo() {
    return request.post('/user/LoginInfo')
}

// 登录代理
export function dlLogin(params) {
    return request.post('/UserLogin/Proxy', params)
    // return request({
    //     url: '/UserLogin/RegesterCode',
    //     method: 'post',
    //     params
    // })
}