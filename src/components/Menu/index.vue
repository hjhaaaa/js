<script lang="jsx">
import { appStoreMixin, deviceMixin } from '@/mixins'
import { generateOpenKeys } from '@/utils'
// import menuData from './menus.js'
import { GetTkMenu, GetAdminMenu } from '@/api/policyMenuApi.js'
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
    },
    type: String
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
    getCurrentLoginMenu(){
      let menus = [
  {
    id: '1',
    icon: 'home',
    path: '/home',
    title: '首页'
  },
  {
    id: '5',
    icon: 'lock',
    path: '/authorize/manage',
    title: '账号授权'
  },
  {
    id: '10',
    icon: 'user',
    path: '/user/manage',
    title: '用户管理'
  },
  {
    id: '20',
    icon: 'desktop',
    path: '/user/workstation',
    title: '工位管理'
  },
  {
    id: '30',
    icon: 'appstore',
    path: '/classifygroup/manage',
    title: '分组管理'
  },
  {
    id: '40',
    icon: 'project',
    path: '/collection/index',
    title: '采集对象'
  },
  {
    id: '50',
    icon: 'setting',
    path: '/groupConfig/manage',
    title: '群发配置'
  },
  {
    id: '70',
    icon: 'credit-card',
    path: '/cardcode/manage',
    title: '激活码管理'
  },
  {
    id: '75',
    icon: 'credit-card',
    path: '/classifygroup/manage2',
    title: '我的测试分组'
  },
]
      this.menus=menus
      /* let mentFunc
      console.log('type',this.type, this.collapsed, this.mode)
      if(this.type == 'tk'){
        mentFunc = GetTkMenu
      }else if(this.type == 'admin'){
        mentFunc = GetAdminMenu
      }
      if(!mentFunc) return
      mentFunc().then((res) => {
			  this.menus = res.Data
      }).catch((err) => {
        console.log(err)
      }) */
    }
  },
  created () {
    this.updateMenu()

    // let _menuArr = [...menuData]
    // this.menus = _menuArr
    this.getCurrentLoginMenu();
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
  .ant-menu-inline .ant-menu-item{
    margin-top: 0px;
    margin-bottom: 0px;
  }
}
</style>
