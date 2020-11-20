import request from '@/api/request/tk'

export function PageList(params) {
    return request.post('/WeChatInfo/PageList', params)
}

// 总开关
export function totalSwitch(params) {
    return request.post('/WeChatInfo/UpdateAutoPassFriendStatus', params)
}



// 列表开关
export function listSwitch(params) {
    return request.post('/WeChatInfo/UpdateWeChatInfoAutoPassFriendStatus', params)
}

// 下拉列表
export function selectList(params) {
    return request.post('/PushMessageTemplate/PagedList', params)
}

// 修改备注
export function updateRemark(params) {
    return request.post('/WeChatInfo/UpdateWeChatInfoRemark', params)
}