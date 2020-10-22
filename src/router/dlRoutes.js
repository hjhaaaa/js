import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'

const whiteRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/dl/login')
  }
]

const routes = [
  {
    path: '/dl',
    name: 'dl',
    component: () => import(/* webpackChunkName: "login" */ '@/views/dl')
  }
]

const dlRoutes = [...whiteRoutes, ...routes]

export default dlRoutes