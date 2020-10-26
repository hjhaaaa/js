import request from '@/api/request/admin'
//管理员列表
export function AdminList(params) {
    return request.post('/Admin/List', params)
}

//创建管理员
export function CreateAdmin(params) {
    return request.post('/Admin/Create',params)
}

//修改管理员
export function EditAdmin(params) {
    return request.post('/Admin/Edit',params)
}
//删除管理员
export function DeleteAdmin(id) {
    return request.post('/Admin/Delete?id='+id)
}
//设置管理员密码
export function SetAdminPassword(id, pwd) {
    return request.post('/user/SetUserPassword', { Id: id, Password: pwd })
}