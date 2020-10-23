import axios from 'axios'
import onError from './index'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import tipMessage from '@/utils/messageUtil.js'
const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [
    function (data, headers) {
      const token = Cookie.get('TokenCk')
      if (token) {
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
  console.log("res", res)
  if (res.data.IsSuccess) {
    return res.data
  } else {
    // notification.error({
    //   message: '错误',
    //   description: res.data.Msg
    // })
    tipMessage.error(res.data.Msg)
    return Promise.reject(res.data)
  }
}, onError)

export default request