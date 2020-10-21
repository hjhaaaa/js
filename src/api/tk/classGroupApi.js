import request from '@/utils/request'
//分组列表
export function ClassifyGroupList(params) {
    return request.post('/ClassifyGroup/list', params)
}
//创建分组
export function EditClassifyGroup(params) {
    return request.post('/ClassifyGroup/Edit', params)
}
//删除分组
export function DeleteClassifyGroup(id) {
    return request.post('/ClassifyGroup/Delete?Id=' + id)
}
//设置目标分组
export function SetTargetClassify(type, id, classifyId) {
    return request.post('/ClassifyGroup/SetClassify', { TargetId: id, TargetType: type, classifyId })
}
//获取目标分组
export function GetTargetClassify(type, id) {
    return request.post('/ClassifyGroup/TargetClassify', { TargetId: id, TargetType: type })
}
//设置采集分组
export function SetCollectionGroupClassify(params) {
    return request.post('/ClassifyGroup/SetCollectionGroup', params)
}

//获取采集分组
export function GetCollectionGroupClassify(id) {
    return request.post('/ClassifyGroup/CollectionClassifyList', { Id: id })
}
//开启分组
export function OpenCollectionGroupClassify(status) {
    return request.post('/ClassifyGroup/OpenClassify', { IsOpen: status })
}
