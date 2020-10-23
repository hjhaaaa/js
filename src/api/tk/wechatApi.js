import request from '@/api/request/tk'

//二维码登录
export function WechatQRLogin(workstationId) {
    return request.get('/Wechat/QRLogin?workstationId=' + workstationId)
}
//退出登录
export function WechatLogout(workstationId) {
    return request.get('/Wechat/Logout?workstationId=' + workstationId)
}
//推送登录
export function WechatPushLogin(workstationId) {
    return request.get('/Wechat/PushLogin?workstationId=' + workstationId)
}
