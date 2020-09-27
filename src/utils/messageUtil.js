import Vue from 'vue'
import notification from 'ant-design-vue/es/notification'
const tipMessage = {
    success(msg) {
        notification.success({
            message: '成功',
            description: msg
        })
    },
    error(msg) {
        notification.error({
            message: '错误',
            description: msg
        })
    }
}
export default tipMessage