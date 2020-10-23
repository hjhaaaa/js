import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'

const whiteRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/auth/adminlogin')
  }
]

const routes = [
  {
    path: '/',
    name: '',
    redirect: '/home',
    component: AppLayout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/home')
      },
    ]
  },
  {
    path: '/cardcode',
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
    path: '/workstation',
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
    path: '/user',
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