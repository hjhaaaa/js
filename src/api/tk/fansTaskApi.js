import request from '@/api/request/tk'

export function CreateFansTask(params) {
    return request.post('/FansTask/CreateFansTask', params)
}

export function FansTaskList(params) {
    return request.post('/FansTask/List', params)
}

export function CreateOrder(params) {
    return request.post('/PaymentProduct/CreateProductOrder', params)
}

export function FansTaskUnderTakeWechatList() {
    return request.get('/FansTask/FansTaskUnderTakeWechatList', {})
}

export function FansTaskWechatGroupList(params) {
    return request.get('/FansTask/FansTaskWechatGroupList', {params})
}