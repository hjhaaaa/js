import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'

const whiteRoutes = [
  {
    path: '/customerservicelogin',
    name: 'customerservicelogin',
    component: () => import(/* webpackChunkName: "login" */ '@/views/auth/customerservicelogin')
  }
]

const routes = [
  {
    path: '/cardcode',
    name: 'cardcodeManage',
    component: AppLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/kefu/cardcode/index.vue')
      }
    ]
  },
  {
    path: '/workstation',
    name: 'workstationManage',
    component: AppLayout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "login" */ '@/views/kefu/workstation/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'userManage',
    component: AppLayout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "login" */ '@/views/kefu/user/index.vue'),
      }
    ]
  }, 
]

const kefuRoutes = [...whiteRoutes, ...routes]

export default kefuRoutes