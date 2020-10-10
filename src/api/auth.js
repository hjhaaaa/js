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

// ===============================================================================

// 获取授权列表
export function authorizeList(params) {
  return request.post('/usertaobaooauth/list', params)
}

// 淘客授权前取state
export function authorizeOauthcheck(params) {
  return request.post('/usertaobaooauth/oauthcheck', params)
}


