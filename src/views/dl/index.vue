<template>
  <div class="dl-box">
    <div class="dl">
      <a-card class="card1" :class="gwIsAll ? 'all' : ''">
        我的账号：{{username}}<br/>
        我的工位：
        <a-button 
          class="gw-btn" 
          :type="item.Id == gwSelect.Id ? 'primary' : ''"
          @click="selectGw(item)"
          v-for="(item, index) in gwList" 
          :key="index">{{item.Id + (item.RNamme ? (`(${item.RNamme})`) : '')}}</a-button>

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
            <img class="img" :src="gwSelect.WXAvatar || require('@/assets/images/dl_tx.png')" alt="">
          </div>
          <div class="div1-r">
            <p class="p">
              <span :style="'color: ' + (gwSelect.WxLogStatus == 1 ? '#52c41a' : '#ff4d4f')">
                [{{gwSelect.WxLogStatus == 1 ? '在线' : '离线'}}]
              </span>
              {{gwSelect.WXNickname || '---'}}
            </p>
            <p class="p">最近登录时间：{{gwSelect.OnLineTime}}</p>
            <p class="p">发单位有效期：{{gwSelect.EndTime}}</p>
          </div>
        </div>
        <div class="c2-div2">
          <a-button class="div2-btn" type="primary" @click="tetsStatus">测试在线状态</a-button>
          <a-button class="div2-btn" type="primary" @click="pushLogin">推送登录</a-button>
          <a-button class="div2-btn" type="primary" @click="codeLogin">扫码登录</a-button>
          <a-button class="div2-btn" type="primary" @click="wxLogout">退出登录</a-button>
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
        <table class="c3-table">
          <tr v-for="(item, index) in fdGroupList" :key="index">
            <td>
              <div class="td1">
                {{item.GroupName}}
                <a-icon type="close-circle" @click="qunDelete(item)" style="vertical-align: -2px" />
              </div>
            </td>
            <td style="width: 42%">
              <input 
                class="td-input" 
                type="text" 
                @focus="qunFocus(item)" 
                @blur="qunBlur(item)" 
                v-model="item.Remarks" placeholder="备注"
              >
            </td>
            <td style="width: 56px">
              <a-switch 
                v-model="item.IsEnable"
                @change="qunChange(item)" 
                checked-children="开" 
                un-checked-children="关" 
              />
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
          <a-switch 
            v-model="SendQuanConfig"
            @change="quanChange" 
            style="float: right;margin: 14px 5px" 
            checked-children="开" 
            un-checked-children="关" 
          />
        </div>
      </a-card>
    </div>
    <div class="shade" v-if="gwIsAll"></div>
    <!--扫码登录-->
		<a-modal
			title="扫码登录"
      class="wx-dl-login"
			:visible="wxloginVisible"
			:footer="null"
			@cancel="wxQrloginHandleCancel"
			width="400px"
		>
			<div>
				<div id="divQrcode" ref="qrCodeUrl"></div>
			</div>
			<div>
				<p style="text-align: center">
					登录二维码将在<span data-v-6e0de69a style="color: red">{{canloginSecond}}</span>失效，请尽快登录
				</p>
        <div>
          登录方式
          <br/>1.将二维码截图发送给他们
          <br/>2.将二维码截图发送至电脑，手机登录
        </div>
			</div>
		</a-modal>
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
  wechatPushLogin,
  wechatLoginStatus,
  wechatQRLogin,
  wechatLogout,
} from '@/api/dl';
import Vue from 'vue'
import tipMessage from '@/utils/messageUtil'
import '@/assets/js/signalr.min.js'
import QRCode from 'qrcodejs2'
import { formate } from '@/filters'

export default {
  name: 'dl-index',
  data() {
    return {
      signalUrl: process.env.VUE_APP_BASE_URL + '/WorkstationHub',
      gwIsAll: false,
      gwList: [],
      username: '',
      gwSelect: {},
      SendQuanConfig: false,
      fdGroupList: [],
      localGwId: 0,
      qunInputText: '',

      signalRconnection: null,
      wxloginType: '',
      wxloginVisible: false,
      canloginSecond: '',
      timer: null,
    }
  },
  created() {
    this.getGwList()
    this.localGwId = Vue.ls.get('GwId') || 0
  },
  methods: {
    getGwList(){
      agentList().then(res => {
        this.username = res.Data.UserName
        const regd = /[^\x00-\xff]/; // 双字节的字符
        res.Data.WorkstationList.forEach((value) => {
          let n_length = 0
          let n_index
          if(value.Remarks){
            for(let i=0;i<value.Remarks.length;i++){
              console.log(value.Remarks[i])
              if(regd.test(value.Remarks[i])){
                n_length += 2
              }else{
                n_length++
              }
              if(n_length > 8){
                n_index = i;
                break;
              }
            }
          }
          if(n_index){
            value.RNamme = value.Remarks.slice(0, n_index) + '...'
          }else{
            value.RNamme = value.Remarks
          }
        })
        this.gwList = res.Data.WorkstationList

        this.getGwDetail()
      })
    },
    getGwDetail(){
      if(this.localGwId){
        let idHas = false
        this.gwList.forEach((value, index) => {
          if(value.Id == this.localGwId){
            idHas = true
            this.gwSelect = Object.assign({}, value)
          }
        })
        if(!idHas){
          this.gwSelect = Object.assign({}, this.gwList[0])
        }
      }else{
        this.gwSelect = Object.assign({}, this.gwList[0])
      }

      // this.gwListMoveFirst() 
      this.SendQuanConfig = this.gwSelect.SendQuanConfig == 1;
      this.getQunList()
    },
    getQunList(){
      sendGroupList({
        PageNum: 1,
        PageSize: 500,
        WorkstationId: this.gwSelect.Id
      }).then(res => {
        this.fdGroupList = res.Data
      })
    },
    selectGw(row){
      if(row.Id !== this.gwSelect.Id){
        this.localGwId = row.Id
        Vue.ls.set('GwId', row.Id)
        this.getGwDetail()
        this.gwIsAll = false
      }
    },
    //============================================================================================================
    // 微信登录
    tetsStatus(){
      wechatLoginStatus({workstationId: this.gwSelect.Id}).then(res => {
        tipMessage.success(res.Msg)
      })
    },
    // 推送登录
    pushLogin(){
      this.wxloginType = 'pushlogin'
      this.connectSignalServer()
    },
    // 二维码登录
    codeLogin(){
      this.wxloginType = 'qrlogin'
      this.connectSignalServer()
    },
    // 关闭弹窗
    wxQrloginHandleCancel() {
			this.wxloginType = ''
			this.canloginSecond = ''
			this.wxloginVisible = false
			$('#divQrcode').empty()
			this.diconnectSignalServer()
		},
    // 退出登录
    wxLogout(){
      wechatLogout({workstationId: this.gwSelect.Id}).then(res => {
        tipMessage.success(res.Msg)
        setTimeout(() => {
          this.getGwList()
        }, 500)
      })
    },
    // 连接
    connectSignalServer() {
			if (this.signalRconnection == null) {
				this.signalRconnection = new signalR.HubConnectionBuilder()
					.withUrl(this.signalUrl)
					.withAutomaticReconnect() //断线自动重连
					.build()
				//接收消息
				this.signalRconnection.on('ReceiveMessage', this.signalRReceiveMessage)

				this.signalRconnection.start()
			} else {
				this.diconnectSignalServer()
				this.connectSignalServer()
			}
		},
		diconnectSignalServer() {
			if (this.signalRconnection) {
				this.signalRconnection.stop()
				this.signalRconnection = null
			}
		},
		signalRReceiveMessage(msg) {
			console.log('signalRconnection:', this.signalRconnection)
			console.log(msg)

			if (!msg.isSuccess) {
				tipMessage.error(msg.text)
				return
			}

			//连接返回的消息
			if (msg.type == 'Connected') {
				console.log('调用服务端设置工位Id方法')
				//调用服务端设置工位Id方法
				this.signalRconnection
					.invoke('SetWorkstationId', this.gwSelect.Id)
					.catch(function (err) {
						this.wxloginType = ''
						console.log('err：', err)
					})
			} else if (msg.type == 'SetWorkstationId') {
				if (!this.wxloginType) {
					return
				}

				if (this.wxloginType == 'qrlogin') {
					console.log('请求二维码登录接口')
					//请求二维码登录接口
					wechatQRLogin({workstationId: this.gwSelect.Id})
						.then((res) => {
							if (res.IsSuccess) {
								this.wxloginVisible = true
								this.$nextTick(() => {
									this.creatQrCode(res.Data.newUrl)
									this.canloginSecond = formate(new Date(new Date().getTime() + 180 * 1000), 'HH:mm:ss')
									// this.doCountDown()
								})
							} else {
								tipMessage.error('请求扫码出错:' + res.Msg)
							}
						})
						.catch(() => {})
				} else if (this.wxloginType == 'pushlogin') {
					console.log('请求推送登录接口')
					//推送登录
					wechatPushLogin({workstationId: this.gwSelect.Id})
						.then((res) => {
							if (res.IsSuccess) {
								tipMessage.success('推送成功,请在手机微信上进行操作')
							} else {
								tipMessage.error('推送失败:' + res.Msg)
							}
						})
						.catch(() => {})
				}
			} else if (msg.type == 'LoginSuccessful') {
        tipMessage.success('登录成功')
        this.wxQrloginHandleCancel()
        this.getGwList()
			}
		},
		creatQrCode(text) {
			var qrcode = new QRCode(this.$refs.qrCodeUrl, {
				text: text,
				width: 300,
				height: 300,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H,
			})
		},
		doCountDown() {
			if (!this.timer) {
				this.timer = setInterval(() => {
					if (this.canloginSecond > 0) {
						this.canloginSecond--
					} else {
						this.stopCountDown()
					}
				}, 1000)
			}
		},
		stopCountDown() {
			clearInterval(this.timer)
			this.timer = null
		},
    //============================================================================================================
    quanChange(){
      updateSendQuan({
        id: this.gwSelect.Id,
        status: this.SendQuanConfig
      }).then(res => {

      }).catch(err => {
        this.SendQuanConfig = !this.SendQuanConfig
      })
    },
    qunChange(row){
      editStatus({
        id: row.Id,
        status: row.IsEnable
      }).then(res => {

      }).catch(err => {
        row.IsEnable = !row.IsEnable
      })
    },
    qunFocus(row){
      this.qunInputText = row.Remarks || '';
    },
    qunBlur(row){
      if(this.qunInputText != (row.Remarks || '')){
        editRemark({
          id: row.Id,
          remark: row.Remarks,
        }).then(res => {

        }).catch(err => {

        })
      }
    },
    qunDelete(row){
      this.$confirm({
        title: '确定删除？',
        content: '发单群：' + row.GroupName,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          sendGroupDelete({
            id: row.Id
          }).then(res => {
            this.getQunList()
          }).catch(err => {

          })
        },
        onCancel() {},
      });
      
    },
    // 所选工位移动到第一
    gwListMoveFirst(){
      let _gwIndex
      let _gwList = JSON.parse(JSON.stringify(this.gwList));
      _gwList.forEach((value, index) => {
        if(value.Id == this.gwSelect.Id){
          _gwIndex = index
        }
      })
      
      if(_gwIndex && _gwIndex > 0){
        let _gwsp = _gwList.splice(_gwIndex, 1)
        _gwList.unshift(_gwsp[0])
        this.gwList = _gwList
      }
    }
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
            margin: 0;
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

.wx-dl-login{
  #divQrcode{
    img{
      margin: 0 auto;
      max-width: 300px;
      width: 100%;
    }
  }
}
</style>

