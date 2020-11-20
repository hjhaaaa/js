import request from '@/api/request/tk'

export function PagedList(params) {
    return request.post('/PushMessageTemplate/PagedList', params)
}

// delete temp 
export function DeletePushMessageTemplate(params) {
    return request.post('/PushMessageTemplate/DeletePushMessageTemplate', params)
}

// 模板内容新增 修改 删除
export function CreatePushMessageTemplate(params) {
    return request.post('/PushMessageTemplate/CreatePushMessageTemplate', params)
}