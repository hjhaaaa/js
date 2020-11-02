import Vue from 'vue'
import { AdminLayout } from '@/components/Layout'
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
    component: AdminLayout,
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
    component: AdminLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/cardcode/index.vue')
      },
    ]
  },
  {
    path: '/cardcode',
    name: 'cardcodeorder',
    component: AdminLayout,
    children: [
      {
        path: 'cardcodeorder',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/cardcode/cardcodeorder.vue')
      }
    ]
  },
  {
    path: '/workstation',
    name: 'workstationManage',
    component: AdminLayout,
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
    component: AdminLayout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/user/index.vue'),
      }
    ]
  },  {
    path: '/admin',
    name: 'adminManage',
    component: AdminLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/account/index.vue')
      },
    ]
  },
  {
    path: '/userwithdrawal',
    name: 'userwithdrawalManage',
    component: AdminLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/admin/userwithdrawal/index.vue')
      },
    ]
  },
]

const adminRoutes = [...whiteRoutes, ...routes]

export default adminRoutes