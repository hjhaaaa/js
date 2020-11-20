import request from '@/api/request/tk'

export function PageList(params) {
    return request.post('/WeChatGroup/PagedList', params)
}

// zong 开关
export function totalSwitch(params) {
    return request.post('/WeChatGroup/UpdateJoinGroupStatus', params)
}

// 修改自动入群状态
export function UpdateWeChatJoinGroupStatus(params) {
    return request.post('/WeChatGroup/UpdateWeChatJoinGroupStatus', params)
}

// 修改备注
export function updateRemark(params) {
    return request.post('/WeChatGroup/UpdateWeChatJoinGroupRemark', params)
}

// 创建消息推送规则
export function CreatePushMessageRule(params) {
    return request.post('/WeChatGroup/CreatePushMessageRule', params)
}

// 修改推送消息规则
export function UpdatePushMessageRule(params) {
    return request.post('/WeChatGroup/UpdatePushMessageRule', params)
}

