import request from '@/api/request/tk'

//提现列表
export function UserWithdrawalList(params) {
    return request.post('/UserWithdrawal/List', params)
}
//申请提现
export function CreateUserWithdrawal(params) {
    return request.post('/UserWithdrawal/Create', params)
}


