import request from '@/utils/request'


// 登出
export function logout() {
  return request.get('/d/aduser/loginout')
}


// ===============================================================================

// 注册发送验证码
export function RegesterCode(params) {
  return request({
    url: '/UserLogin/RegesterCode',
    method: 'post',
    params
  })
}

// 注册
export function Regester(params) {
  return request({
    url: '/UserLogin/Regester',
    method: 'post',
    data: params
  })
}

// 登录
export function login(params) {
  return request({
    url: '/UserLogin/Account',
    method: 'post',
    data: params
  })
}

