<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
// eslint-disable-next-line
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { deviceEnquire } from '@/utils/device'

export default {
  name: 'app',
  data () {
    return {
      zh_CN
    }
  },
  mounted () {
    deviceEnquire(deviceType =>
      this.$store.commit('app/SET_DEVICE', deviceType)
    )
  }
}
</script>
<style>
.ant-table{
  font-size: 10px !important;      
}
.left-h3{
  padding-left: 5px;
  border-left: 3px solid #1890ff;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>