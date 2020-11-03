
import notification from 'ant-design-vue/es/notification'
import router from '@/router'
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
  }
  return Promise.reject(error)
}

export default onError
