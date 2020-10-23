import Vue from 'vue'
import axios from 'axios'
import notification from 'ant-design-vue/es/notification'

// api 配置

let timer = null

const onError = error => {
  if (error.response) {
    const status = error.response.status
    const message = error.response.statusText

    if (status === 403) {
      notification.error({ message: '禁止访问', description: message })
    }

    if (status === 404) {
      notification.error({ message: '未知资源', description: message })
    }

    if (status === 405) {
      notification.error({ message: '错误码：405', description: message })
    }

    if (status === 500) {
      notification.error({
        message: '服务器错误',
        description: message
      })
    }

    if (status === 401 && !timer) {
      timer = setTimeout(() => {
        notification.error({
          message: '未授权',
          description: '授权失败，请重新登录'
        })
        timer = null
      }, 1000)
    }
  }
  return Promise.reject(error)
}

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [
    function (data, headers) {
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
