import Vue from 'vue'
import { login as userLogin, logout as userLogout, getuserrouter } from '@/api/auth'
import { ACCESS_TOKEN, USER, ROUTER, EVENSET } from '@/store/mutation-types'
import { AppLayout } from '@/components/Layout'

function CreatArry(obj) {
  var copy = [];
  obj.forEach(item => {
    let T = {
      path: '/tk/' + item.Url,
      name: '',
      meta: {
        title: item.Title,
        icon: item.Icon
      },
      id: item.Id,
      hidden: item.Hidden,
      component: () => import('@/views/tk/' + item.Url)
    }
    copy.push(T)
  });
  console.log(copy)
  return copy;
}


const user = {
  namespaced: true,
  state: {
    token: '',
    user: null,
    router: '',
  },
  getters: {
    username(state) {
      return (state.user && state.user.username) || ''
    },
    router(state) {
      return state.router
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      Vue.ss.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
      state.token = token
    },
    SET_USER: (state, user) => {
      Vue.ss.set(USER, user)
      state.user = user
    },
    SET_Router: (state, router) => {
      if (router && router[0].children.length > 1) {
        Vue.ss.set(ROUTER, router)
        Vue.ss.set(EVENSET, 1)
        state.router = router
      }

    }
  },

  actions: {
    // 登录
    Login({ commit, dispatch }, userInfo) {
      return new Promise(async (resolve, reject) => {
        userLogin(userInfo).then(res => {
          commit('SET_USER', { username: userInfo.LoginName })
          resolve(res)
        }).catch(err => {
          reject(err.data)
        })
      })
    },
    Logout({ commit, state }) {
      return new Promise(async resolve => {
        await userLogout()
        console.log(1111111111111111111)
        commit('SET_USER', { username: '' })
        Vue.ss.set(EVENSET, 0)
        resolve()
      })
    },
    GenerateRoutes({ commit, state }) {
      return new Promise(async resolve => {
        var t = await getuserrouter()
        const asyncRouterMap = CreatArry(t);

        console.log('...asyncRouterMap', asyncRouterMap)
        let Obj = [];
        Obj = [{
          path: '/home',
          name: 'home',
          id: '0',
          meta: {
            title: "首页", icon: ""
          },
          hidden: 0,
          component: () => import(/* webpackChunkName: "login" */ '@/views/tk/home')
        }, ...asyncRouterMap];
        let TkRoutes = [
          {
            path: '/',
            name: 'index',
            redirect: '/login',
            component: AppLayout,
            children: Obj
          }
        ]


        // let accessedRouters
        // fetchRouter().then(response => {
        //   // const asyncRouterMap = CreatArry(response.data.result.items)
        //   const asyncRouterMap = CreatArry(response.data.items)
        //   // const asyncRouterMap = CreatArry(response.data.items)
        //   // if (roles.indexOf('admin') >= 0) {
        //   //   accessedRouters = asyncRouterMap
        //   // } else {
        //   //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        //   // }
        //   accessedRouters = asyncRouterMap
        //   commit('SET_ROUTERS', accessedRouters)
        //   resolve()
        // })


        console.log('TkRoutes', TkRoutes);
        // console.log('t', t)
        commit('SET_Router', TkRoutes)
        resolve()
      })
    }
  }
}

export default user
