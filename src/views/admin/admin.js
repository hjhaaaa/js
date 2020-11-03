import Vue from 'vue'
import '@/plugins'
import router from '@/router/index'
import { store, initStore } from '@/store/index'
import App from './App.vue'

import '@/assets/styles/index.scss'

Vue.config.productionTip = false

new Vue({
  router: router.adminRouter,
  store,
  render: h => h(App),
  created () {
    initStore()
  }
}).$mount('#app')
