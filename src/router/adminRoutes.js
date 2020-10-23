import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'

const whiteRoutes = [
  {
    path: '/admin/login',
    name: 'adminlogin',
    component: () => import(/* webpackChunkName: "login" */ '@/views/auth/adminlogin')
  }
]

const routes = [
  {
    path: '/admin/cardcode',
    name: 'cardcodeManage',
    component: AppLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/cardcode/index.vue')
      },
    ]
  },
  {
    path: '/admin/workstation',
    name: 'workstationManage',
    component: AppLayout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/workstation/index.vue'),
      }
    ]
  },
  {
    path: '/admin/user',
    name: 'userManage',
    component: AppLayout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/user/index.vue'),
      }
    ]
  },
]

const adminRoutes = [...whiteRoutes, ...routes]

export default adminRoutes