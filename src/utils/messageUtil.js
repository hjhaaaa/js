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
    },
    info(msg) {
        notification.info({
            message: '提示',
            description: msg
        })
    },
    // confirmDelete(msg, okAction, cancelAction) {
    //     console.log(this, confirm)
    //     if (!msg) {
    //         msg = "确定删除？"
    //     }

    //     confirm({
    //         title: '提示',
    //         content: msg,
    //         okText: '确定',
    //         okType: 'danger',
    //         onOk() {
    //             if (typeof (okAction) == "function") {
    //                 okAction();
    //             }
    //         },
    //         onCancel() {
    //             if (typeof (cancelAction) == "function") {
    //                 cancelAction();
    //             }
    //         }
    //     })
    // }
}
export default tipMessage