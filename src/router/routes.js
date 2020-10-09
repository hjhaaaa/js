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
    },    
    {
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
        path: '/group',
        name: 'group',
        component: AppLayout,
        children: [
            {
                path: 'index',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/group/index.vue')
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
