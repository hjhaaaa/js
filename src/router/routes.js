import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'

const otherRoutes = [
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
        path: '/dl',
        name: 'dl',
        component: () => import(/* webpackChunkName: "login" */ '@/views/dl')
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
const yfdRoutes = [
    {
        path: '/user',
        name: 'userManage',
        component: AppLayout,
        children: [
            {
                path: 'manage',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/user/user.vue')
            }, {
                path: 'workstation',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/user/workstation.vue')
            }
        ]
    }, {
        path: '/cardcode',
        name: 'cardcodeManage',
        component: AppLayout,
        children: [
            {
                path: 'manage',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/cardcode/cardcode.vue')
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
                component: () => import(/* webpackChunkName: "login" */ '@/views/collection/index.vue')
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
                component: () => import(/* webpackChunkName: "login" */ '@/views/authorize/index.vue')
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
                component: () => import(/* webpackChunkName: "login" */ '@/views/groupConfig/index.vue')
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
                component: () => import(/* webpackChunkName: "login" */ '@/views/classifygroup/classifygroup.vue')
            },
        ]
    },
]
const agentRoutes = [
    {
        path: '/agent',
        name: 'agentmanage',
        component: ViewLayout,
        children: [
            {
                path: 'index',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/agent/index.vue')
            },
        ]
    }
]


const TkRoutes = [
    {
        path: '/',
        name: 'index',
        redirect: '/login',
        component: AppLayout,
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import(/* webpackChunkName: "login" */ '@/views/tk/home')
            },
            {
                path: '/tk/data',
                name: '',
                meta: {
                    title: '淘客全盘数据',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/data')
            },
        ]
    }
]

const routes = [...otherRoutes, ...TkRoutes, ...yfdRoutes]


// Vue.use(Router)

// export default new Router({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes
// })


// const router = createRouter(routes)

export default routes
