import request from '@/api/request/tk'

  // 拼多多授权前取state
  export function authorizeOauthPddcheck(params) {
    return request.get('/UserPddOauth/OauthCheck', {params})
  }
  
