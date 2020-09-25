import request from '@/utils/request'
//工位列表
export function WorkstationList(params) {
    return request.post('/Workstation/list', params)
}
//创建代理工位
export function CreateWorkstation(userId) {
    return request.post('/Workstation/Create?userId=' + userId)
}
//删除工位
export function DeleteWorkstation(id) {
    return request.post('/Workstation/Delete?Id=' + id)
}
//修改工位状态
export function UpdateWorkstationStatus(id, status) {
    return request.post('/Workstation/UpdateStatus?Id=' + id + "&status=" + status)
}
//修改工位备注
export function UpdateWorkstationRemark(id, remark) {
    return request.post('/Workstation/UpdateRemark?Id=' + id + "&remark=" + remark)
}
