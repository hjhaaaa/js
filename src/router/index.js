import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import store from '../store'
import 'nprogress/nprogress.css' // progress bar style
// import routes from './routes'
import tkRoutes from './tkRoutes'
import dlRoutes from './dlRoutes'
import kefuRoutes from './kefuRoutes'
import { USER, ROUTER, EVENSET, ACCESS_TOKEN } from '@/store/mutation-types'
import { AppLayout } from '@/components/Layout'

Vue.use(Router)
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['regester','login', '404'] // no redirect whitelist

export const createRouter = (routes) =>
  new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
  })

const router = {
  tkRouter: createRouter(tkRoutes),
  dlRouter: createRouter(dlRoutes),
  kefuRouter: createRouter(kefuRoutes)
}

Object.keys(router).forEach((value) => {
  router[value].beforeEach((to, from, next) => {
    NProgress.start()
    const token = Vue.ls.get(ACCESS_TOKEN);
    if (token) {
      next()
    } else {
      if(to.name == 'login'){
        next()
      }else{
        next()
      }
    }
  })
  
  router[value].afterEach(() => {
    NProgress.done() // finish progress bar
  })
})

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   const token = Vue.ls.get(ACCESS_TOKEN);
//   if (token) {
//     if (to.name === 'login') {
//       next()
//     } else {
//       next()
//     }
//   } else {
//     next()
//     // if (whiteList.includes(to.name)) {
//     //   next()
//     // } else {
//     //   next({ path: '/login' })
//     // }
//   }
// })

// router.afterEach(() => {
//   NProgress.done() // finish progress bar
// })



export default router
