import request from '@/utils/request'
//发送群列表
export function SendGroupList(params) {
    return request.post('/SendGroup/list', params)
}

//删除发送群
export function DeleteSendGroup(id) {
    return request.post('/SendGroup/Delete?Id=' + id)
}
//修改发送群状态
export function UpdateSendGroupStatus(id, status) {
    return request.post('/SendGroup/EditStatus?Id=' + id + "&status=" + status)
}
//修改发送群备注
export function UpdateSendGroupRemark(id, remark) {
    return request.post('/SendGroup/EditRemark?Id=' + id + "&remark=" + remark)
}
