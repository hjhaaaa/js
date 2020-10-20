import request from '@/utils/request'

//创建卡密订单
export function CreateCardCodeOrder(params) {
    return request.post('/CardCodeOrder/Create', params)
}
