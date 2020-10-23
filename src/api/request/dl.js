import axios from 'axios'
import onError from './index'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [
    function (data, headers) {
      const token = Cookie.get('TokenUserCk')
      if(token){
        headers[ACCESS_TOKEN] = 'Bearer ' + token;
      }
      if (headers['Content-Type'] === 'multipart/form-data') {
        return data
      } else {
        return JSON.stringify(data)
      }
    }
  ]
})

// 响应拦截器
request.interceptors.response.use(res => {
  if(res.data.IsSuccess){
    return res.data
  }else{
    notification.error({
      message: '错误',
      description: res.data.Msg
    })
    return Promise.reject(res.data)
  }
}, onError)

export default request