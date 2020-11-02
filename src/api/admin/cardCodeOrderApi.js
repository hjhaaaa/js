import request from '@/api/request/admin'

//创建卡密订单
export function CreateCardCodeOrder(params) {
    return request.post('/CardCodeOrder/Create', params)
}

// 获取卡密订单列表
export function CardCodeOrderList(params) {
    return request.post('/CardCodeOrder/List', params)
}