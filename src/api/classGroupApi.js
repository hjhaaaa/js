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

