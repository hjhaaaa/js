import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'


const whiteRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/auth/login')
  },
  {
    path: '/regester',
    name: 'regester',
    component: () => import(/* webpackChunkName: "login" */ '@/views/auth/regester')
  },
  {
    path: '/error',
    name: 'error',
    redirect: '404',
    component: ViewLayout,
    children: [
      {
        path: '404',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ '@/views/error/404')
      }
    ]
  }
]

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/index',
    component: AppLayout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/home')
      },
    ]
  },
  {
    path: '/user',
    name: 'userManage',
    component: AppLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/user/user.vue')
      },
      {
        path: 'workstation',
        name: 'workstation',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/user/workstation.vue'),
        params: {
          userName: ''
        }
      }
    ]
  },
  {
    path: '/cardcode',
    name: 'cardcodeManage',
    component: AppLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/cardcode/cardcode.vue')
      },
    ]
  },
  {
    path: '/collection',
    name: 'collectionManege',
    component: AppLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/collection/index.vue')
      },
    ]
  },
  {
    path: '/authorize',
    name: 'authorizeManage',
    component: AppLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/authorize/index.vue')
      },
    ]
  },
  {
    path: '/groupConfig',
    name: 'groupConfigManage',
    component: AppLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/groupConfig/index.vue')
      },
    ]
  },
  {
    path: '/classifygroup',
    name: 'classifygroupManage',
    component: AppLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import(/* webpackChunkName: "login" */ '@/views/tk/classifygroup/classifygroup.vue')
      },
    ]
  },
]

const tkRoutes = [...whiteRoutes, ...routes]

export default tkRoutes
