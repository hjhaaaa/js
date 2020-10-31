import request from '@/api/request/admin'
//工位列表
export function WorkstationList(params) {
    return request.post('/Workstation/list', params)
}
//工位更换设备
export function UpdateWorkstationDevice(id) {
    return request.post('/Workstation/UpdateDevice?Id=' + id )
}
