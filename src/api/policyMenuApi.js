import tkRequest from '@/api/request/tk'
import adminRequest from '@/api/request/admin'

// 获取淘客菜单
export function GetTkMenu() {
    return tkRequest.get('/policyMenu/List')
}

// 获取admin菜单
export function GetAdminMenu() {
    return adminRequest.get('/policyMenu/List')
}
