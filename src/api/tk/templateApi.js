import request from '@/api/request/tk'

export function PushMessageTemplateList(params) {
    return request.post('/PushMessageTemplate/List', params)
}

export function DeletePushMessageTemplate(params) {
    return request.post('/PushMessageTemplate/DeletePushMessageTemplate', params)
}