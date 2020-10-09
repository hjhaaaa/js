import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import store from '../store'
import 'nprogress/nprogress.css' // progress bar style
import routes from './routes'
import { USER, ROUTER, EVENSET, ACCESS_TOKEN } from '@/store/mutation-types'
import { AppLayout } from '@/components/Layout'

Vue.use(Router)
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['regester','login', '404'] // no redirect whitelist

export const createRouter = () =>
  new Router({		
    mode: 'history',		
    base: process.env.BASE_URL,		
    routes
  })

const router = createRouter()

router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = Vue.ss.get(USER);
  if (token && token.username) {
    if (to.name === 'login') {
      next()
    } else {
      next()
    }
  } else {
    next()
    // if (whiteList.includes(to.name)) {
    //   next()
    // } else {
    //   next({ path: '/login' })
    // }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
