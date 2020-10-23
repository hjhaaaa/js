import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import { store, initStore } from '@/store/index'

import '@/plugins'

// import * as filters from '@/filters'
// import '@/assets/styles/index.scss'
// import commonFunc from '@/utils/mformat.js'

// Vue.use(commonFunc)

// /* 定义全局过滤器 */
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })


// import $ from 'jquery'
// window.$ = $
// window.jQuery = $


Vue.config.productionTip = false

new Vue({
  router: router.tkRouter,
  store,
  render: h => h(App),
  created () {
    initStore()
  }
}).$mount('#app')
