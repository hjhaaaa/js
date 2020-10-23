import request from '@/api/request/admin'
//用户列表
export function UserList(params) {
    return request.post('/user/list', params)
}
//设置用户为供应商
export function SetUserSupplier(id) {
    return request.post('/user/setSupplier?id='+id)
}
//设置用户密码
export function SetUserPassword(id, pwd) {
    return request.post('/user/SetUserPassword', { Id: id, Password: pwd })
}
