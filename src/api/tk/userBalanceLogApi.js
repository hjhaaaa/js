import request from '@/api/request/tk'

//用户余额流水
export function CardCodeRebateList(params) {
    return request.post('/UserBalanceLog/CardCodeRebateList', params)
}



