import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import '@/plugins'



Vue.config.productionTip = false

new Vue({
  router: router.dlRouter,
  render: h => h(App),
  created () {
    initStore()
  }
}).$mount('#app')
