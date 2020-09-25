import request from '@/utils/request'

//获取基础配置
export function GetBasicsConfig(id, configType) {
    return request.get('/BasicsConfig/Get?id=' + id + '&configType=' + configType)
}

//设置发送群基础配置
export function SetSendGroupBasicsConfig(params) {
    return request.post('/BasicsConfig/SetSendGroup', params)
}
//设置用户基础配置
export function SetUserBasicsConfig(params) {
    return request.post('/BasicsConfig/SetUser', params)
}
//设置工位基础配置
export function SetWorkstationConfig(params) {
    return request.post('/BasicsConfig/SetWorkstation', params)
}


