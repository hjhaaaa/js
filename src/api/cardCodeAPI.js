import request from '@/utils/request'
//卡密列表
export function CardCodeList(params) {
    return request.post('/CardCode/List', params)
}

//获取卡密
export function GetRechargeCode(params) {
    return request.get('/CardCode/GetRechargeCode')
}
//充值工位
export function RechargeWorkstation(params) {
    return request.post('/CardCode/WorkRecharge', params)
}