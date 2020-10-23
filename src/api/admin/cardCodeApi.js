import request from '@/api/request/admin'
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
//批量转让卡密

export function BatchTransferCardCode(params) {
    return request.post('/CardCode/BatchTransfer', params)
}