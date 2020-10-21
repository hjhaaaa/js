import request from '@/utils/request'


// 获取授权列表
export function authorizeList(params) {
    return request.post('/usertaobaooauth/list', params)
  }
  
  // 淘客授权前取state
  export function authorizeOauthcheck(params) {
    return request.get('/usertaobaooauth/oauthcheck', {params})
  }
  
