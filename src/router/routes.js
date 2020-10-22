import Vue from 'vue'
import { AppLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'

const otherRoutes = [
    {
        path: '/login',
        name: 'login',
        type: 1,
        component: () => import(/* webpackChunkName: "login" */ '@/views/auth/login')
    },
    {
        path: '/customerservicelogin',
        name: 'customerservicelogin',
        component: () => import(/* webpackChunkName: "login" */ '@/views/auth/customerservicelogin')
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
    },
]
const tkRoutes = [
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
            }, {
                path: 'workstation',
                name: 'workstation',
                component: () => import(/* webpackChunkName: "login" */ '@/views/tk/user/workstation.vue'),
                params: {
                    userName: ''
                }
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
const kefuRoutes = [
    {
        path: '/cardcode',
        name: 'cardcodeManage',
        component: AppLayout,
        children: [{
            path: 'index',
            name: '',
            component: () => import(/* webpackChunkName: "login" */ '@/views/kefu/cardcode/index.vue')
        },
        ]
    }, {
        path: '/workstation',
        name: 'workstationManage',
        component: AppLayout,
        children: [ {
                path: 'index',
                component: () => import(/* webpackChunkName: "login" */ '@/views/kefu/workstation/index.vue'),
    
            }
        ]
    }, {
        path: '/user',
        name: 'userManage',
        component: AppLayout,
        children: [ {
                path: 'index',
                component: () => import(/* webpackChunkName: "login" */ '@/views/kefu/user/index.vue'),
    
            }
        ]
    }, 
]

const routes = [...otherRoutes,  ...tkRoutes,...kefuRoutes]

// Vue.use(Router)

// export default new Router({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes
// })


// const router = createRouter(routes)

export default routes
