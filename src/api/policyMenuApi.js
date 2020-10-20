import request from '@/utils/request'

//获取当前登录人菜单
export function GetCurrentLoginMenu() {
    return request.get('/policyMenu/List')
}
