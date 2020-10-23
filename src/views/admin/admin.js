import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import { store, initStore } from '@/store/index'
import '@/plugins'


Vue.config.productionTip = false

new Vue({
  router: router.adminRouter,
  store,
  render: h => h(App),
  created () {
    initStore()
  }
}).$mount('#app')
