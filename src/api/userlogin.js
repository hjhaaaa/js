import request from '@/utils/request'
//注册验证码
export function sendRegesterCode(phone) {
    return request.post(`/api/UserLogin/RegesterCode`, { "phone": phone });
}
//用户注册
export function userRegester(params) {
    return request.post(`/api/UserLogin/Regester`, params);
}
//用户账户登录
export function userAccountLogin(params) {
    return request.post(`/api/UserLogin/Account`, params);
}
//发送登录验证码
export function sendLoginCode(phone) {
    return request.post(`/api/UserLogin/LoginCode`, { "phone": phone });
}
//用户手机号登录
export function userPhoneLogin(params) {
    return request.post(`/api/UserLogin/Phone`, params);
}