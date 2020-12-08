<template>
  <div class="dl-box">
    <div class="dl">
      <a-card class="card1" :bordered="false">
        <div class="card1-div1">我的账号：{{username}}</div>
        <div class="card-div2">
          <div class="div2-1">我的工位：</div>
          <div class="div2-2">
            <a href="javascript:;"
              class="gw-btn" 
              :class="item.Id == gwSelect.Id ? 'hover' : ''"
              @click="selectGw(item)"
              v-for="(item, index) in gwList" 
              :key="index"
            >{{item.Id + (item.RNamme ? (` [${item.RNamme}]`) : '')}}</a>
          </div>
          <div class="div2-3" @click="gwIsAll = !gwIsAll">
            查看全部<a-icon type="down" />
          </div>
        </div>
      </a-card>
      <a-card class="card2" :bordered="false">
        <div class="c2-div1">
          <div class="div1-img">
            <img class="img" :src="gwSelect.WXAvatar || require('@/assets/images/dl_tx.png')" alt="">
          </div>
          <div class="div1-r">
            <div class="p1">{{gwSelect.WXNickname || '---'}}</div>
            <div class="p2" :class="gwSelect.WxLogStatus == 1 ? 'zx' : ''">

              <span class="span"></span>
              {{gwSelect.WxLogStatus == 1 ? '在线' : '离线'}}
            </div>
            <div class="p3">最近登录时间：{{gwSelect.OnLineTime}}</div>
            <div class="p4">发单位有效期：{{gwSelect.EndTime}}</div>
          </div>
        </div>
        <div class="c2-div2">
          <a href="javascript:;" class="div2-btn" @click="tetsStatus">测试在线状态</a>
          <a href="javascript:;" class="div2-btn" @click="pushLogin">推送登录</a>
          <a href="javascript:;" class="div2-btn" @click="codeLogin">扫码登录</a>
          <a href="javascript:;" class="div2-btn" style="margin-right: 0" @click="wxLogout">退出登录</a>
        </div>
        <div class="card-tip">
          <span style="color: #555555">使用说明：</span><br/>
          1.首次登录请扫码登录，之后可以用推送登录，若推送失败，请再次用扫码登录，推送登录：点击此按钮后请在微信点击确认登录。<br/>
          2.添加工位后请联系经销商激活。<br/>
          3.如果出现不发单情况，可检测微信在线状态，掉线了重新登录即可。
        </div>
      </a-card>
      <a-card class="card3" :bordered="false">
        <h3 class="card-h3">发单群</h3>
        <table class="c3-table">
          <tr v-for="(item, index) in fdGroupList" :key="index">
            <td>
              <div class="td1">
                {{item.GroupName}}
                <!-- <a-icon type="close-circle" @click="qunDelete(item)" style="vertical-align: -2px" /> -->
              </div>
            </td>
            <td style="width: 42%">
              <input 
                class="td-input" 
                type="text" 
                @focus="qunFocus(item)" 
                @blur="qunBlur(item)" 
                v-model="item.Remarks" placeholder="输入备注"
              >
            </td>
            <td style="width: 0.8rem;text-align: center">
              <a-switch 
                style="margin-top: -0.05rem"
                v-model="item.IsEnable"
                @change="qunChange(item)" 
              />
            </td>
            <td style="width: 0.6rem;text-align: center">
              <a href="javascript:;" @click="qunDelete(item)">删除</a>
            </td>
          </tr>
        </table>
        <div class="card-tip">
          <span style="color: #555555">发单群绑定说明：</span><br/>
          1. 登录发单的微信，并保持在线登录（在此登录之后不可以在别的电脑等设备上登录）；<br/>
          2. 在需要发单的微信群发送绑定口令：绑定，系统会自动回复：绑定成功，若未回复，请清理此手机微信数据，重新登录并在此操作；
        </div>
      </a-card>
      <a-card class="card4" :bordered="false">
        <h3 class="card-h3">朋友圈</h3>
        <div class="card4-div1">
          跟发朋友圈
          <a-switch 
            v-model="SendQuanConfig"
            @change="quanChange" 
            style="float: right;margin: 0.08rem 0.05rem" 
          />
        </div>
      </a-card>

      <a-card class="card4" :bordered="false">
        <h3 class="card-h3">粉丝群</h3>
        <div class="card4-div1">
          发财群
          <a-switch 
            v-model="SendQuanConfig"
            @change="fsQunChange" 
            style="float: right;margin: 0.08rem 0.05rem" 
          />
        </div>
        <div class="card-tip">
          <span style="color: #555555">开启本功能，将自动通过粉丝入群申请，发送入群欢迎语及开群公告等</span><br/><br/>
          <span style="color: #555555">粉丝群绑定说明：</span><br/>
          1. 登录群管号的微信，并保持在线登录（在此登录之后不可以在别的电脑等设备上登录）；<br/>
          2. 在需要绑定的微信群发送绑定口令：绑定粉丝群，系统会自动回复：绑定成功，若未回复，请清理此手机微信数据，重新登录并再次操作；
        </div>
      </a-card>

      <a-card class="card4" :bordered="false">
        <h3 class="card-h3">接粉号</h3>
        <div class="card4-div1">
          自动接粉
          <a-switch 
            v-model="SendQuanConfig"
            @change="jfHaoChange" 
            style="float: right;margin: 0.08rem 0.05rem" 
          />
        </div>
        <div class="card-tip">
          <span style="color: #555555">开启本功能，将自动通过粉丝好友申请、引导入群及免单发放</span><br/><br/>
          <span style="color: #555555">接粉权限开通说明：</span><br/>
          1. 登录接粉号的微信，并保持在线登录（在此登录之后不可以在别的电脑等设备上登录）；<br/>
          2. 给自己发送口令：开通接粉权限，系统会自动回复：开通成功，若未回复，请清理此手机微信数据，重新登录并再次操作；
        </div>
      </a-card>
    </div>
    <div class="dl-shade" v-if="gwIsAll" @click.stop="gwIsAll = false">
      <div class="dl-s-box" @click.stop>
        <a href="javascript:;"
          class="gw-btn" 
          :class="item.Id == gwSelect.Id ? 'hover' : ''"
          @click="selectGw(item)"
          v-for="(item, index) in gwList" 
          :key="index"
        >{{item.Id + (item.RNamme ? (` [${item.RNamme}]`) : '')}}</a>
      </div>
    </div>
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
  getGroupMana,
  setGroupMana,
  getAcceptFans,
  setAcceptFans,
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
      this.getFsQun()
      this.getJfHao()
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
    // 获取粉丝群
    getFsQun(){
      getGroupMana({
        WxId: this.gwSelect.Id
      }).then(res => {
        console.log(res)
      })
    },
    fsQunChange(){
      setGroupMana({
        Id: '',
        IsOpen: ''
      }).then(res => {

      }).catch(err => {

      })
    },
    getJfHao(){
      getAcceptFans({
        WxId: this.gwSelect.Id
      }).then(res => {
        console.log(res)
      })
    },
    jfHaoChange(){
      setAcceptFans({
        WxId: '',
        IsOpen: ''
      }).then(res => {

      }).catch(err => {

      })
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
  max-width: 750px;
  min-width: 320px;
  margin: 0 auto;
  background-color: #F5F5F5;
  position: relative;
  .dl{
    padding: 0.08rem 0.24rem 0.24rem;
    .card-h3{
      font-size: 0.32rem;
      color: #1F1F1F;
      font-weight: bold;
      margin: 0;
    }
    .card1{
      position: relative;
      .card1-div1{
        font-size: 0.28rem;
        line-height: 0.4rem;
        font-weight: bold;
        color: #555555;
      }
      .card-div2{
        height: 0.4rem;
        margin-top: 0.2rem;
        overflow: hidden;
        .div2-1{
          float: left;
          font-size: 0.28rem;
          line-height: 0.36rem;
          font-weight: bold;
          color: #555555;
        }
        .div2-2{
          float: left;
          width: 3.7rem;
          .gw-btn{
            float: left;
            height: 0.36rem;
            line-height: 0.36rem;
            font-size: 0.24rem;
            color: #555555;
            padding: 0 0.1rem;
            border: 1px solid #F5F5F5;
            border-radius: 0.04rem;
            margin-right: 0.16rem;
            margin-bottom: 0.16rem;
            box-sizing: content-box;
            background-color: #F5F5F5;
          }
          .gw-btn.hover{
            color: #44A4FF;
            background-color: rgba(68, 164, 255, 0.06);
            border: 1px solid #44A4FF;
          }
        }
        .div2-3{
          float: right;
          font-size: 0.22rem;
          font-weight: bold;
          color: #B0AFAF;
          line-height: 0.36rem;
        }
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
    .card2{
      .c2-div1{
        overflow: hidden;
        .div1-img{
          float: left;
          width: 1.64rem;
          height: 1.64rem;
          margin-right: 0.28rem;
          .img{
            width: 1.64rem;
            height: 1.64rem;
            border-radius: 0.1rem;
          }
        }
        .div1-r{
          float: left;
          height: 1.64rem;
          overflow: hidden;
          .p1{
            height: 0.44rem;
            line-height: 0.44rem;
            font-size: 0.3rem;
            font-weight: bold;
            color: #1F1F1F;
            margin: 0;
          }
          .p2{
            height: 0.38rem;
            line-height: 0.38rem;
            font-size: 0.24rem;
            color: #ff4d4f;
            margin: 0;
            .span{
              float: left;
              width: 0.12rem;
              height: 0.12rem;
              background-color: #ff4d4f;
              border-radius: 50%;
              margin: 0.13rem 0.12rem 0 0;
            }
          }
          .p2.zx{
            color: #52c41a;
            .span{
              background-color: #52c41a;
            }
          }
          .p3{
            font-size: 0.24rem;
            font-weight: bold;
            color: #8C8C8C;
            line-height: 0.38rem;
            margin-top: 0.02rem;
          }
          .p4{
            font-size: 0.24rem;
            font-weight: bold;
            color: #8C8C8C;
            line-height: 0.38rem;
            margin-top: 0.04rem;
          }
        }
      }
      .c2-div2{
        margin-top: 0.3rem;
        overflow: hidden;
        .div2-btn{
          float: left;
          height: 0.5rem;
          line-height: 0.5rem;
          font-size: 0.22rem;
          font-weight: bold;
          color: #44A4FF;
          padding: 0 0.2rem;
          margin-right: 0.2rem;
          position: relative;
        }
        .div2-btn::after{
          content: '';
          position: absolute;
          width: 100%;
          height: 0.5rem;
          top: 0;
          left: 0;
          border-radius: 0.5rem;
          border: 1px solid #44A4FF;
        }
      }
    }
    .card3{
      .c3-table{
        margin-top: 0.08rem;
        width: 100%;
        .td1{
          // white-space: nowrap;
          overflow: hidden;
        }
        td{
          height: 0.98rem;
          padding: 0.18rem 0;
          border-bottom: 1px solid #E6E6E6;
          font-size: 0.26rem;
          color: #555555;
          line-height: 0.62rem;
          .td-input{
            width: 100%;
            border: 0;
            padding: 1px 5px;
            text-align: center;
            border-radius: 5px;
            outline: none;
          }
        }
      }
    }
    .card4{
      .card4-div1{
        font-size: 0.26rem;
        color: #555555;
        line-height: 0.5rem;
      }
    }
    .card-tip{
      font-size: 0.24rem;
      font-weight: bold;
      line-height: 0.4rem;
      color: #B0AFAF;
      background-color: #F5F5F5;
      padding: 0.28rem;
      border-radius: 0.12rem;
      margin-top: 0.3rem;
    }
  }
  .dl-shade::after{
    content: '';
    position: absolute;
    right: 0.6rem;
    top: 0;
    border-bottom: 0.11rem solid #FFF;
    border-left: 0.11rem solid transparent;
    border-right: 0.11rem solid transparent;
  }
  .dl-shade{
    position: absolute;
    top: 1.8rem;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0, .5);
    z-index: 99;
    .dl-s-box{
      width: 7.02rem;
      margin: 0.1rem auto;
      background-color: #FFF;
      box-shadow: 0px 1px 0.1rem 0px rgba(0, 0, 0, 0.05);
      border-radius: 0.16rem;
      padding: 0.2rem 0.34rem;
      overflow: hidden;
    }
    .gw-btn{
      float: left;
      height: 0.36rem;
      line-height: 0.36rem;
      font-size: 0.24rem;
      color: #555555;
      padding: 0 0.1rem;
      border: 1px solid #F5F5F5;
      border-radius: 0.04rem;
      margin-right: 0.16rem;
      margin-bottom: 0.16rem;
      box-sizing: content-box;
      background-color: #F5F5F5;
    }
    .gw-btn.hover{
      color: #44A4FF;
      background-color: rgba(68, 164, 255, 0.06);
      border: 1px solid #44A4FF;
    }
  }
}
</style>

<style lang="scss">
.dl-box{
  .dl{
    .ant-card{
      margin-top: 0.16rem;
      box-shadow: 0px 1px 0.1rem 0px rgba(0, 0, 0, 0.05);
      border-radius: 0.16rem;
    }
    .ant-card-body{
      padding: 0.28rem 0.34rem;
    }
    .ant-switch{
      min-width: 0.56rem;
      height: 0.34rem;
      border: 0;
      .ant-switch-inner{
        
      }
    }
    .ant-switch-loading-icon, .ant-switch::after{
      width: 0.26rem;
      height: 0.26rem;
      top: 0.04rem;
      left: 0.04rem;
    }
    .ant-switch-checked::after{
      left: 100%;
      margin-left: -0.04rem;
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

