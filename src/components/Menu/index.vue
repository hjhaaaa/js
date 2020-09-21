<script lang="jsx">
import { mapState } from 'vuex'
import { appStoreMixin, deviceMixin } from '@/mixins'
import { generateOpenKeys } from '@/utils'
import menuData from './menus.js'
import Vue from 'vue'
import { ROUTER } from '@/store/mutation-types'
 
export default {
  mixins: [appStoreMixin, deviceMixin],
  props: {
    mode: {
      type: String,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedKeys: [],
      openKeys: [],
      cacheOpenKeys: [],
      menus: []
    }
  },
  computed: {
    // ...mapState('permission', ['menus']),
    isSide () {
      return (
        this.layoutMode === 'side' ||
        (this.layoutMode === 'top' && this.isMobile)
      )
    }
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cacheOpenKeys = [].concat(this.openKeys)
        this.openKeys = []
      } else {
        this.openKeys = this.cacheOpenKeys
      }
    },
    $route (val) {
      this.updateMenu()
    }
  },
  methods: {
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys[openKeys.length - 1]
      const keyPath = latestOpenKey ? latestOpenKey.split('/') : []
      keyPath.shift()
      this.openKeys = generateOpenKeys(keyPath)
    },
    handleMenuClick ({ item, key, keyPath }) {
      this.selectedKeys = [keyPath[0]]
      this.$router.push(key)
      this.$emit('close')
    },
    updateMenu () {
      // fullPath : '/customs/export/query'
      let openKeys = []
      const { fullPath } = this.$route
      const keyPath = fullPath.split('/')
      keyPath.shift()
      keyPath.pop()
      this.selectedKeys = [fullPath]
      
      if (this.mode === 'inline') {
        openKeys = generateOpenKeys(keyPath)
      }
      
      this.collapsed
        ? (this.cacheOpenKeys = openKeys)
        : (this.openKeys = openKeys)
    },
    getCookie(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    }
  },
  created () {
    this.updateMenu()
    let _name = this.getCookie('_tkdataadmin_nick')

    console.log('xxxxx',Vue.ss.get(ROUTER))
    let T = Vue.ss.get(ROUTER);
    let Meu=[];
    T[0].children.forEach(item => {
      let Obj={};
      if(item.hidden==0){
        if(item.name=='home'){
          Obj={
            id: '0',
            icon: 'home',
            path: '/home',
            name: 'home',
            title: '首页'
          }
        }else{
          Obj={
            id: item.id,
            icon: item.meta.icon,
            path: item.path,
            name: item.name,
            title: item.meta.title
          }
        }
        Meu.push(Obj)
        
      }
    });
    let _menuArr = [...menuData]

    //
    console.log('xxxxxx',Meu);
    //  let _menuArr = [...Meu]
     
    // if(
    //   _name != 'admin' 
    //   && _name != 'xiaomeng' 
    //   && _name != 'guobinbin'
    // ){
    //   _menuArr.splice(1,1)
    // }
    // 拦截菜单  shoufadan账号
    if(_name == 'shoufadan'){
      this.menus = [
        {
          id: '91',
          icon: 'appstore',
          path: '/tk/sfdcount',
          name: 'sfdcount',
          title: '首发单数据'
        },
      ]
    }else if(
      _name == 'zhangjing' ||
      _name == 'chepengpeng' ||
      _name == 'zhoukaiyi' ||
      _name == 'jialingling' ||
      _name == 'fanxiwei' ||
      _name == 'caoshucheng' ||
      _name == 'linqi' ||
      _name == 'liaoxingxing' ||
      _name == 'guobinbin' ||
      _name == 'wangyuanyuan' ||
      _name == 'zhangyanni' ||
      _name == 'huxiongjian'
    ){
      this.menus = [
        {
          id: '92',
          icon: 'appstore',
          path: '/tk/newUserFollowUp',
          name: 'newUserFollowUp',
          title: '组团新用户跟进'
        }
      ]
    }else{
      this.menus = _menuArr
    }
  },
  render () {
    const {
      isSide,
      menuTheme,
      mode,
      openKeys,
      selectedKeys,
      $route,
      menus,
      handleMenuClick,
      onOpenChange
    } = this
    
    const menuWrapClass = [
      'lu-menu',
      isSide && 'lu-menu__side',
      `lu-menu__${ menuTheme }`
    ]
    
    const menuProps = {
      mode,
      openKeys,
      selectedKeys,
      theme: menuTheme,
      defaultSelectedKeys: [$route.path]
    }
    
    const menuEvent = {
      click: handleMenuClick,
      openChange: onOpenChange
    }
    
    // 递归生成菜单
    function generateMenu (menus) {
      if (menus) {
        return menus.map(menu => {
          if (menu.children && menu.children.length) {
            return (
              <a-sub-menu key={ menu.path }>
                <span slot="title">
                  { menu.icon && <a-icon type={ menu.icon } /> }
                  <span>{ menu.title }</span>
                </span>
                { generateMenu(menu.children) }
              </a-sub-menu>
            )
          } else {
            return (
              <a-menu-item key={ menu.path }>
                { menu.icon && <a-icon type={ menu.icon } /> }
                <span>{ menu.title }</span>
              </a-menu-item>
            )
          }
        })
      }
    }
    
    return (
      <div class={ menuWrapClass }>
        <a-menu props={ menuProps } on={ menuEvent }>
          { generateMenu(menus) }
        </a-menu>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.lu-menu {
	&.lu-menu__side {
		border-top: 1px solid #3d4348;

		&.lu-menu__light {
			border-top-color: rgba(61, 67, 72, 0.1);
		}
	}
}

.ant-menu {
	background: transparent;

	&.ant-menu-horizontal {
		height: 65px;
		line-height: 65px;
	}

	.ant-menu-inline.ant-menu-sub {
		background: rgba(37, 37, 37, 1);
		box-shadow: none;
	}
}
</style>
