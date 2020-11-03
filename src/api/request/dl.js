import axios from 'axios'
import onError from './index'
import router from '@/router/index'
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
let timer = null
request.interceptors.response.use(res => {
  if(res.data.IsSuccess){
    return res.data
  }else{
    // notification.error({
    //   message: '错误',
    //   description: res.data.Msg
    // })
    tipMessage.error(res.data.Msg)
    return Promise.reject(res.data)
  }
}, err => {
  const status = err.response.status
  const message = err.response.statusText
  if (status === 401 && !timer) {
    timer = setTimeout(() => {
      tipMessage.error('授权失败，请重新登录')
      timer = null
      router.dlRouter.push('/login')
    }, 1000)
  }else{
    onError(err)
  }
})

export default request