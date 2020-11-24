import Vue from 'vue'
import { TkLayout, ViewLayout } from '@/components/Layout'
import Router from 'vue-router'


const whiteRoutes = [
  {
    path: '*',
    redirect: '/error/404',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login')
  },
  {
    path: '/regester',
    name: 'regester',
    component: () => import('@/views/auth/regester')
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
    name: '',
    redirect: '/home',
    component: TkLayout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/tk/home')
      },
    ]
  },
  {
    path: '/user',
    name: 'userManage',
    component: TkLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import('@/views/tk/user/user.vue')
      },
      {
        path: 'workstation',
        name: 'workstation',
        component: () => import('@/views/tk/user/workstation.vue'),
        params: {
          userName: ''
        }
      }, {
        path: 'cardcoderebate',
        name: 'cardcoderebate',
        component: () => import('@/views/tk/user/cardcoderebate.vue'),
        params: {
          userName: ''
        }
      }, {
        path: 'suppliertk',
        name: 'suppliertk',
        component: () => import('@/views/tk/user/suppliertk.vue'),
      }
    ]
  },
  {
    path: '/cardcode',
    name: 'cardcodeManage',
    component: TkLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import('@/views/tk/cardcode/cardcode.vue')
      },
    ]
  },
  {
    path: '/collection',
    name: 'collectionManege',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/tk/collection/index.vue')
      },
    ]
  },
  {
    path: '/authorize',
    name: 'authorizeManage',
    component: TkLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import('@/views/tk/authorize/index.vue')
      },
    ]
  },
  {
    path: '/groupConfig',
    name: 'groupConfigManage',
    component: TkLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import('@/views/tk/groupConfig/index.vue')
      },
    ]
  },
  {
    path: '/classifygroup',
    name: 'classifygroupManage',
    component: TkLayout,
    children: [
      {
        path: 'manage',
        name: '',
        component: () => import('@/views/tk/classifygroup/classifygroup.vue')
      },
    ]
  },
  {
    path: '/moments',
    name: 'moments',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/tk/moments/index.vue')
      },
    ]
  },
  {
    path: '/moments',
    name: 'moments',
    component: TkLayout,
    children: [
      {
        path: 'tbDetail',
        name: '',
        component: () => import('@/views/tk/moments/tbDetail.vue')
      },
    ]
  },
  {
    path: '/moments',
    name: 'moments',
    component: TkLayout,
    children: [
      {
        path: 'pddDetail',
        name: '',
        component: () => import('@/views/tk/moments/pddDetail.vue')
      },
    ]
  },
  {
    path: '/moments',
    name: 'moments',
    component: TkLayout,
    children: [
      {
        path: 'scDetail',
        name: '',
        component: () => import('@/views/tk/moments/scDetail.vue')
      },
    ]
  },
  {
    path: '/fanstask',
    name: 'moments',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/tk/fanstask/index.vue')
      }
    ]
  },
  {
    path: '/template',
    name: 'moments',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/tk/template/index.vue')
      }
    ]
  },
  {
    path: '/powderManagement',
    name: 'powder',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '接粉管理',
        component: () => import('@/views/tk/powderManagement/index.vue')
      }
    ]
  },
  {
    path: '/groupManagement',
    name: 'group',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '入群管理',
        component: () => import('@/views/tk/groupManagement/index.vue')
      }
    ]
  },
  {
    path: '/templateManagement',
    name: 'group',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '模板管理',
        component: () => import('@/views/tk/templateManagement/index.vue')
      },
      {
        path: 'addEditTemplate/:id',
        name: 'AddEditTemplate',
        component: () => import('@/views/tk/templateManagement/addEditTemplate.vue'),
        params: {
          userName: ''
        }
      }
    ]
  },
  {
    path: '/activationCode',
    name: 'ActivationCode',
    component: TkLayout,
    children: [
      {
        path: 'index',
        name: '激活码',
        component: () => import('@/views/tk/activationCode/index.vue')
      }
    ]
  }
]

const tkRoutes = [...whiteRoutes, ...routes]

export default tkRoutes
