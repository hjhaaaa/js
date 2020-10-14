<template>
  <div class="dl-box">
    <div class="dl">
      <a-card class="card1" :class="gwIsAll ? 'all' : ''">
        我的账号：{{username}}<br/>
        我的工位：
        <a-button 
          class="gw-btn" 
          :type="item.Id == gwSelect.Id ? 'primary' : ''"
          v-for="(item, index) in gwList" 
          :key="index">{{item.Id}}</a-button>

        <a href="javascript:;" class="card1-more" @click="gwIsAll = !gwIsAll">
          <a-icon v-if="!gwIsAll" type="down" />
          <a-icon v-if="gwIsAll" type="up" />
          <span v-if="!gwIsAll">查看全部</span>
          <span v-if="gwIsAll">收起全部</span>
        </a>
      </a-card>
      <a-card class="card2">
        <div class="c2-div1">
          <div class="div1-img">
            <img class="img" src="http://wx.qlogo.cn/mmhead/ver_1/k7348sJ6IlXNphZiaqGicFXvHgjaytQrzquC8X0yYIhfEHasYxwiaPIV3DPleevxWSVO0qpBoT4wnT8b5kN9nlB7VWFV2Vyia31UhIJkoPHkVC8/0" alt="">
          </div>
          <div class="div1-r">
            <p class="p">[在线]微信昵称</p>
            <p class="p">最近登录时间：2020-09-09 09:09:09</p>
            <p class="p">发单位有效期：2020-09-09 09:09:09</p>
          </div>
        </div>
        <div class="c2-div2">
          <a-button class="div2-btn" type="primary">测试在线状态</a-button>
          <a-button class="div2-btn" type="primary">推送登录</a-button>
          <a-button class="div2-btn" type="primary">扫码登录</a-button>
          <a-button class="div2-btn" type="primary">退出登录</a-button>
        </div>
        <div class="c2-div3">
          使用说明<br/>
          1.首次登录请扫码登录，之后可以用推送登录，若推送失败，请再次用扫码登录，推送登录：点击此按钮后请在微信点击确认登录。<br/>
          2.添加工位后请联系经销商激活。<br/>
          3.如果出现不发单情况，可检测微信在线状态，掉线了重新登录即可。
        </div>
      </a-card>
      <a-card class="card3">
        <h3 class="card-h3">
          <span class="h3-span">发单群</span>
        </h3>
        <!-- <ul class="c3-ul">
          <li>
            
          </li>
        </ul> -->
        <table class="c3-table">
          <tr>
            <td>
              <div class="td1">
                妈妈群
                <a-icon type="close-circle" style="vertical-align: -2px" />
              </div>
            </td>
            <td style="width: 42%">
              <input class="td-input" type="text" placeholder="备注">
            </td>
            <td style="width: 56px">
              <a-switch checked-children="开" un-checked-children="关" />
            </td>
          </tr>
        </table>
        <div style="margin-top: 0.3rem">
          发单群绑定说明<br/>
          1. 登录发单的微信，并保持在线登录（在此登录之后不可以在别的电脑等设备上登录）；<br/>
          2. 在需要发单的微信群发送绑定口令：绑定，系统会自动回复：绑定成功，若未回复，请清理此手机微信数据，重新登录并在此操作；
        </div>
      </a-card>
      <a-card class="card4">
        <h3 class="card-h3">
          <span class="h3-span">朋友圈</span>
        </h3>
        <div style="line-height: 50px">
          跟发朋友圈
          <a-switch style="float: right;margin: 14px 5px" checked-children="开" un-checked-children="关" />
        </div>
      </a-card>
    </div>
    <div class="shade" v-if="gwIsAll"></div>
  </div>
</template>

<script>
import { 
  agentList,
  sendGroupList,
  editRemark,
  editStatus,
  sendGroupDelete,
  updateSendQuan,
} from '@/api/dl';

export default {
  name: 'dl-index',
  data() {
    return {
      gwIsAll: false,
      gwList: [],
      username: '',
      gwSelect: {},
    }
  },
  created() {
    this.getGwList()
  },
  methods: {
    getGwList(){
      agentList().then(res => {
        this.username = res.Data.UserName
        this.gwList = res.Data.WorkstationList
        this.gwSelect = this.gwList[0]
        this.getQunList()
      })
    },
    getQunList(){
      sendGroupList({
        PageNum: 1,
        PageSize: 500,
        WorkstationId: this.gwSelect.Id
      }).then(res => {
        
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.dl-box{
  max-width: 500px;
  min-width: 320px;
  margin: 0 auto;
  .dl{
    padding: 0.2rem;
    .card-h3{
      font-size: 18px;
      font-weight: bold;
      .h3-span{
        border-bottom: 3px solid rgba(0, 0, 0, 0.85);
        padding: 3px 0;
      }
    }
    .card1{
      position: relative;
      .gw-btn{
        margin-bottom: 10px;
        margin-right: 10px;
      }
      .card1-more{
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        text-align: center;
        padding: 5px 0;
        background-color: #FFF;
      }
    }
    .card1.all{
      position: fixed;
      z-index: 199;
      width: 7.1rem;
    }
    .card2{
      margin-top: 0.2rem;
      background-color: #e0feea;
      .c2-div1{
        overflow: hidden;
        .div1-img{
          float: left;
          width: 1.5rem;
          height: 1.5rem;
          margin-right: 0.2rem;
          .img{
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
          }
        }
        .div1-r{
          float: left;
          .p{
            font-size: 0.28rem;
            line-height: 0.5rem;
          }
        }
      }
      .c2-div2{
        margin-top: 0.2rem;
        .div2-btn{
          font-size: 0.28rem;
          height: 0.7rem;
          padding: 0 0.1rem;
          margin-right: 0.1rem;
        }
      }
      .c2-div3{
        font-size: 0.28rem;
        line-height: 0.42rem;
        margin-top: 0.3rem;
      }
    }
    .card3{
      margin-top: 0.2rem;
      .c3-ul{
        margin-top: 10px;
        li{
          height: 50px;
          line-height: 50px;
        }
      }
      .c3-table{
        margin-top: 0.1rem;
        width: 100%;
        .td1{
          // white-space: nowrap;
          overflow: hidden;
          width: 100%;
        }
        td{
          background-color: rgba(245,108,108, .5);
          padding: 5px;
          .td-input{
            width: 100%;
            border: 0;
            padding: 1px 5px;
            text-align: center;
            border-radius: 5px;
            outline: none;
          }
          .td-input{

          }
        }
      }
    }
    .card4{
      margin-top: 0.2rem;
    }
  }
  .shade{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background-color: rgba(245,108,108, .5);
    background-color: rgba(0,0,0, .5);
    z-index: 99;
  }
}
</style>

<style lang="scss">
.dl-box{
  .dl{
    .ant-card-body{
      padding: 0.2rem;
    }
    .card1{
      .ant-card-body{
        height: 58px;
        box-sizing: content-box;
        overflow: hidden;
        padding-bottom: 31px;
        transition: all .5s;
      }
    }
    .card1.all{
      .ant-card-body{
        height: 352px;
        overflow: scroll;
        
      }
    }
  }
}
</style>

