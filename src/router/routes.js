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
        component: ViewLayout,
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
        component: ViewLayout,
        children: [
            {
                path: 'manage',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/cardcode/cardcode.vue')
            },
        ]
    }, {
        path: '/classifygroup',
        name: 'classifygroupManage',
        component: ViewLayout,
        children: [
            {
                path: 'manage',
                name: '',
                component: () => import(/* webpackChunkName: "login" */ '@/views/classifygroup/classifygroup.vue')
            },
        ]
    }
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
            {
                path: '/tk/dataMon',
                name: '',
                meta: {
                    title: '淘客月全盘数据',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/dataMon')
            },
            {
                path: '/tk/dataDetail',
                name: '',
                meta: {
                    title: '淘客全盘数据详情',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/dataDetail')
            },
            {
                path: '/tk/report',
                name: '',
                meta: {
                    title: '淘客增长率报表',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/report')
            },
            {
                path: '/tk/group',
                name: '',
                meta: {
                    title: '群组管理',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/group')
            },
            {
                path: '/tk/laxin',
                name: '',
                meta: {
                    title: '美逛拉新数据列表',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/laxin')
            },
            {
                path: '/tk/zigou',
                name: '',
                meta: {
                    title: '美逛自购数据列表',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/zigou')
            },
            {
                path: '/tk/zgReport',
                name: '',
                meta: {
                    title: '美逛自购数据报表',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/zgReport')
            },
            {
                path: '/tk/cps',
                name: '',
                meta: {
                    title: '美逛CPS数据',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/cps')
            },
            {
                path: '/tk/mdtj',
                name: '',
                meta: {
                    title: '淘客免单数据',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/mdtj')
            },
            {
                path: '/tk/coincount',
                name: '',
                meta: {
                    title: '金币大盘',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/coincount')
            },
            {
                path: '/tk/sfdcount',
                name: '',
                meta: {
                    title: '首发单数据',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/sfdcount')
            },
            {
                path: '/tk/newUserFollowUp',
                name: '',
                meta: {
                    title: '组团新用户跟进',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/newUserFollowUp')
            },
            {
                path: '/tk/tkUserInfo/:id',
                name: '',
                meta: {
                    title: '淘客数据详情',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/tkUserInfo')
            },
            {
                path: '/tk/qmmdtj',
                name: '',
                meta: {
                    title: '全民免单数据',
                    icon: ''
                },
                component: () => import(/* webpackChunkName: "table" */ '@/views/tk/qmmdtj')
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
