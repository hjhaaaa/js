import request from '@/api/request/admin'

//提现列表
export function UserWithdrawalList(params) {
    return request.post('/UserWithdrawal/List', params)
}
//导出列表
export function UserWithdrawalExportExcel(params) {
    return request.post('/UserWithdrawal/ExportExcel', params)
}
//审核通过
export function UserWithdrawalReviewPass(id) {
    return request.post('/UserWithdrawal/ReviewPass', { Id: id, remark: "" })
}
//审核驳回
export function UserWithdrawalReviewReject(id, remark) {
    return request.post('/UserWithdrawal/ReviewReject', { Id: id, remark: remark })
}


