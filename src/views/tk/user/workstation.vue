<template>
	<div class="workstation">
		<a-card title="工位列表" :bordered="false">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<!-- <div class="searchrow"> -->
				<a-form-item label="工位Id">
					<a-input v-model="form.Id" placeholder="请输入工位Id" />
				</a-form-item>
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>
				<a-form-item label="工位备注">
					<a-input v-model="form.Remark" placeholder="请输入关键词" />
				</a-form-item>
				<a-form-item label="工位状态">
					<a-select
						style="width: 150px"
						v-model="form.Status"
						:options="statusOptions"
					></a-select>
				</a-form-item>
				<a-form-item label="微信状态">
					<a-select
						v-model="form.WxStatus"
						:options="wxStatusOptions"
					></a-select>
				</a-form-item>
				<a-form-item label="充值类型">
					<a-select
						style="width: 120px"
						v-model="form.RechageType"
						:options="rechageTypeOptions"
					></a-select>
				</a-form-item>
				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
				<!-- </div> -->
			</a-form>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
				<template slot="editRemarks" slot-scope="text, row">
					<editable-cell
						:text="text"
						@change="remarksChange(row, 'Remarks', $event)"
						editTitle="编辑备注"
					/>
				</template>
				<!-- v-if="row.StationRechageType==2" -->
				<div slot="UserNameSlot" slot-scope="row">
					{{ row.UserName }}
					<div>
						<a-tag v-if="row.StationType == 1" color="blue">淘客</a-tag>
					</div>
				</div>
				<div slot="Status" slot-scope="row">
					<a-tag v-if="row.StationRechageType == 2" color="purple"
						>增强版</a-tag
					>
					<a-tag v-else-if="row.StationRechageType == 1" color="blue"
						>普通版</a-tag
					>

					<a-tag v-if="isShowExpireTag(row)" color="red">即将到期</a-tag>
					<p>状态:{{ row.WorkStatus == 2 ? '启用' : '禁用' }}</p>
					<p>到期时间:{{ formatEndDate(row) }}</p>
					<p>设备号:{{ row.Uid }}</p>
				</div>
				<div slot="showWXAvatar" slot-scope="row">
					<img :src="row.WXAvatar" class="WXAvatar" />
				</div>
				<div slot="wxOp" class="wxOp" slot-scope="row">
					<a-button type="primary" @click="wxQrLogin(row)">扫码登录</a-button>
					<a-button type="primary" @click="wxPushlogin(row)">推送登录</a-button>
					<a-button type="primary" @click="wxLogout(row)">退出微信</a-button>
				</div>
				<div slot="wxStatus" slot-scope="row">
					<div v-if="row.WxLogStatus == 1">
						<a-tag color="#87d068">在线</a-tag>
						<p>最近登录：</p>
						<p>{{ row.OnLineTime || ' ' }}</p>
					</div>
					<div v-else>
						<a-tag>离线</a-tag>
						<p>最近离线：</p>
						<p>{{ row.OffLineTime || ' ' }}</p>
					</div>
				</div>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					<a-switch
						checked-children="开"
						un-checked-children="关"
						:checked="!!row.SwitchStatus"
						@change="editSwitchStatus(row)"
					/>
				</div>
				primary
				<div class="table operation" slot="opti" slot-scope="row">
					<a-button type="primary" @click="showRecharge(row)" size="small"
						>充值工位</a-button
					>
					<a-button type="primary" @click="showSendGroup(row)" size="small"
						>发单群</a-button
					>
					<br />
					<a-button type="primary" @click="setConfig(row)" size="small"
						>指定配置</a-button
					>
					<a-button type="primary" @click="setGroup(row)" size="small"
						>指定分组</a-button
					>
					<br />
					<a-button
						type="primary"
						@click="removeWorkstation(row)"
						size="small"
						:disabled="IsCanDelete(row)"
						>删除工位</a-button
					>
				</div>
			</a-table>
			<div style="margin-top: 15px">
				<a-pagination
					size="small"
					:pageSize.sync="form.pageSize"
					v-model="form.pageNum"
					@change="pageChange"
					:total="total"
					showQuickJumper
					:showTotal="(total) => `共${total}条`"
				/>
			</div>
		</a-card>

		<!--充值弹窗-->
		<a-modal
			:title="rechargeTitle"
			:visible="rechargeVisible"
			:closable="false"
		>
			<template slot="footer">
				<a-button key="back" @click="rechargeHandleCancel">取消</a-button>
				<a-button
					key="submit"
					type="primary"
					:loading="rechargeButtonLoading"
					@click="rechargeHandleOk"
					:disabled="rechargeButtonDisabled"
					>确定</a-button
				>
			</template>
			<a-form :form="rechargeForm" :model="rechargeInfo" ref="rechargeForm">
				<!-- <p v-bind="formItemLayout">工位类型设置后将不能修改</p> -->
				<a-form-item
					v-bind="formItemLayout"
					label="工位类型"
					prop="RechageType"
				>
					<a-radio-group
						v-model="rechargeInfo.RechageType"
						@change="rechageTypeChange"
					>
						<a-radio :value="1">基础版 有效期30天 10个发单群</a-radio>
						<a-radio :value="2">增强版 有效期30天 60个发单群</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="需要卡密数">
					<a-input
						v-model="rechargeInfo.NeedCardCodeCount"
						autocomplete="off"
						read-only
					/>
					<!-- <span>剩余卡密数：{{rechargeInfo.CardCodeCount}}</span> -->
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="剩余卡密数：">{{
					rechargeInfo.CardCodeCount
				}}</a-form-item>
			</a-form>
		</a-modal>

		<!--扫码登录-->
		<a-modal
			:visible="wxloginVisible"
			class="wxlogin"
			title="扫码登录"
			:footer="null"
			@cancel="wxQrloginHandleCancel"
			width="400px"
		>
			<div>
				<div id="divQrcode" ref="qrCodeUrl"></div>
			</div>
			<div>
				<p style="text-align: center">
					请在
					<span data-v-6e0de69a style="color: red">{{ canloginSecond }}</span
					>秒以内扫码登录微信
				</p>
				<p>登录方式</p>
				<p>1.将二维码截图发送给他们</p>
				<p>2.将二维码截图发送至电脑，手机登录</p>
			</div>
			<!-- <div>
				<img :src="wxloginQr" />
			</div>-->
		</a-modal>

		<Sendgroup ref="sendgroup"></Sendgroup>
		<BasicsConfig :configType="2" ref="basicsConfig"></BasicsConfig>
		<SetClassifyGroup :targetType="2" ref="setClassifyGroup"></SetClassifyGroup>
	</div>
</template>

<script>
import moment from 'moment'
// import 'jquery'
// import { mgCpsList, cpsdropdownlist } from '@/api/auth.js'
import SetClassifyGroup from '@/components/ClassifyGroup/SetClassifyGroup.vue'
import Sendgroup from '@/components/Sendgourp/Sendgourp.vue'
import BasicsConfig from '@/components/Config/BasicsConfig.vue'
import EditableCell from '@/components/Table/EditableCell.vue'
import tipMessage from '@/utils/messageUtil.js'
import $ from 'jquery'
import '@/assets/js/signalr.min.js'
import {
	WorkstationList,
	DeleteWorkstation,
	UpdateWorkstationStatus,
	UpdateWorkstationRemark,
} from '@/api/tk/workstationApi.js'
import {
	WechatQRLogin,
	WechatLogout,
	WechatPushLogin,
} from '@/api/tk/wechatApi.js'
import {
	SendGroupList,
	DeleteSendGroup,
	UpdateSendGroupStatus,
	UpdateSendGroupRemark,
} from '@/api/tk/sendGroupApi.js'
import { GetRechargeCode, RechargeWorkstation } from '@/api/tk/cardCodeApi.js'
import { constants } from 'zlib'
import { callbackify, log } from 'util'
import { deeppink } from 'color-name'
import QRCode from 'qrcodejs2'
export default {
	name: 'user-workstation',
	components: { EditableCell, Sendgroup, BasicsConfig, SetClassifyGroup },
	data() {
		return {
			signalUrl: 'https://yfdcallbacktest.comzt.cn:30080/WorkstationHub',
		//	signalUrl: 'http://192.168.11.129:30080/WorkstationHub',
			statusOptions: [
				{ label: '全部', value: -1 },
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
				{ label: '三天内到期', value: 2 },
			],
			wxStatusOptions: [
				{ label: '全部', value: -1 },
				{ label: '在线', value: 1 },
				{ label: '离线', value: 0 },
			],
			rechageTypeOptions: [
				{ label: '全部', value: -1 },
				{ label: '未充值', value: 0 },
				{ label: '普通版', value: 1 },
				{ label: '增强版', value: 2 },
			],
			aform: this.$form.createForm(this),
			rechargeForm: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				Id: '',
				Remark: '',
				Status: -1,
				UserName: '',
				pageSize: 10,
				pageNum: 1,
				WxStatus: -1,
				RechageType: -1,
			},
			columns: [
				{
					title: '工位Id',
					width: '70px',
					dataIndex: 'Id',
					fixed: 'left',
				},
				{
					title: '用户名',
					Key: 'UserName',
					width: '170px',
					// dataIndex: 'UserName',
					scopedSlots: { customRender: 'UserNameSlot' },
				},
				{
					title: '备注',
					Key: 'Remarks',
					width: '200px',
					dataIndex: 'Remarks',
					scopedSlots: { customRender: 'editRemarks' },
				},
				{
					title: '微信用户',
					Key: '',
					width: '150px',
					dataIndex: '',
					scopedSlots: { customRender: 'showWXAvatar' },
				},
				{
					title: '微信操作',
					Key: '',
					width: '120px',
					dataIndex: '',
					scopedSlots: { customRender: 'wxOp' },
				},
				{
					title: '微信状态',
					Key: '',
					width: '100px',
					dataIndex: '',
					scopedSlots: { customRender: 'wxStatus' },
				},
				{
					title: '工位状态',
					key: 'Status',
					width: '120px',
					scopedSlots: { customRender: 'Status' },
				},
				{
					title: '发单状态',
					key: 'SwitchStatus',
					width: '100px',
					scopedSlots: { customRender: 'opSwitchStatus' },
				},
				{
					title: '创建时间',
					Key: 'CTime',
					width: '200px',
					dataIndex: 'CTime',
				},
				{
					title: '操作',
					width: '200px',
					scopedSlots: { customRender: 'opti' },
				},
			],
			visible: false, //添加用户
			data: [],
			total: 0,
			tableLoading: false,
			rechargeTitle: '用户充值',
			rechargeVisible: false, //充值页面
			rechargeButtonDisabled: null, //确定充值按钮可用状态
			rechargeButtonLoading: false,
			rechargeInfo: {
				WorkstationId: 0,
				RechageType: 1,
				CardCodeCount: 0,
				NeedCardCodeCount: 1,
			},

			signalRconnection: undefined, //signalR对象
			currentLoginWorkstation: undefined, //当前正在登录的工位
			wxloginVisible: false,
			timer: null,
			canloginSecond: 200,
			wxloginType: 'qrcode',
		}
	},
	mounted() {
		var $this = this
	},
	methods: {
		query() {
			this.tableLoading = true
			WorkstationList(this.form)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		handleSearch() {
			this.form.pageNum = 1
			this.query()
		},
		pageChange(p, s) {
			this.form.pageNum = p
			this.query()
		},
		remarksChange(row, key, value) {
			if (!value) return
			UpdateWorkstationRemark(row.Id, value)
				.then((res) => {
					if (res.IsSuccess) {
						tipMessage.success('保存成功')
					} else {
						tipMessage.error('保存失败:' + res.Msg)
					}
				})
				.catch(() => {})
		},
		wxQrLogin(row) {
			this.connectSignalServer()
			this.currentLoginWorkstation = row
			this.wxloginType = 'qrlogin'
		},
		wxQrloginHandleCancel() {
			console.log('wxQrloginHandleCancel')
			this.wxloginType = ''
			this.canloginSecond = 0
			this.wxloginVisible = false
			this.currentLoginWorkstation = undefined
			$('#divQrcode').empty()
			this.diconnectSignalServer()
		},
		wxPushlogin(row) {
			this.wxloginType = 'pushlogin'
			this.connectSignalServer()
			this.currentLoginWorkstation = row
		},
		wxLogout(row) {
			WechatLogout(row.Id)
				.then((res) => {
					if (res.IsSuccess) {
						tipMessage.success('退出成功')
						this.query()
					} else {
						tipMessage.error('退出失败:' + res.Msg)
					}
				})
				.catch(() => {})
		},
		editSwitchStatus(row) {
			let nowRow = this.data.find((item) => {
				return item.Id == row.Id
			})

			var newValue = !row.SwitchStatus
			UpdateWorkstationStatus(row.Id, newValue)
				.then((res) => {
					nowRow.SwitchStatus = newValue
					tipMessage.success('操作成功')
				})
				.catch(() => {
					notification.error({
						message: '错误',
						description: '操作失败:' + res.Msg,
					})
					nowRow.SwitchStatus = !newValue
				})
		},
		showSendGroup(row) {
			this.$refs.sendgroup.openSendgroup(row)
		},
		showRecharge(row) {
			//充值弹窗充值
			let v = this
			GetRechargeCode()
				.then((res) => {
					console.log('rechargeInfo', v.rechargeInfo)

					if (res.IsSuccess) {
						v.rechargeInfo.WorkstationId = row.Id
						v.rechargeInfo.RechageType = 1
						this.rechargeInfo.NeedCardCodeCount = 1
						v.rechargeInfo.CardCodeCount = res.Data.CardCodeCount
						v.rechargeTitle =
							'充值用户【' + row.UserName + '】工位【' + row.Id + '】'
						this.checkNeedCardCodeCount()
						this.rechargeVisible = true
					} else {
						tipMessage.error('获取卡密失败')
					}
				})
				.catch(() => {})
		},
		checkNeedCardCodeCount() {
			if (
				this.rechargeInfo.CardCodeCount >= this.rechargeInfo.NeedCardCodeCount
			) {
				this.rechargeButtonDisabled = null
			} else {
				this.rechargeButtonDisabled = ''
			}
		},
		rechageTypeChange(e) {
			if (e.target.value == 2) {
				this.rechargeInfo.NeedCardCodeCount = 3
			} else {
				this.rechargeInfo.NeedCardCodeCount = 1
			}
			this.checkNeedCardCodeCount()
		},
		rechargeHandleOk() {
			let v = this
			var content = '当前选择【普通版(30天)10个发单群】消耗1个卡密,确认继续?'
			if (v.rechargeInfo.RechageType == 2) {
				content = '当前选择【增强版(30天)60个发单群】,消耗3个卡密,确认继续?'
			}
			this.$confirm({
				title: '提示',
				content: content,
				okText: '确定',
				onOk() {
					v.tableLoading = true
					RechargeWorkstation({
						workstationId: v.rechargeInfo.WorkstationId,
						rechageType: v.rechargeInfo.RechageType,
					})
						.then((res) => {
							if (res.IsSuccess) {
								v.query()
								v.$message.success('充值成功')
								v.rechargeVisible = false
							} else {
								tipMessage.error(res.msg)
							}
							v.tableLoading = false
							v.rechargeInfo.WorkstationId = 0
						})
						.catch(() => {
							v.tableLoading = false
							v.rechargeInfo.WorkstationId = 0
						})
				},
				onCancel() {},
			})
		},
		rechargeHandleCancel() {
			this.rechargeVisible = false
		},
		removeWorkstation(row) {
			let v = this //保存外层this对象
			//删除工位
			this.$confirm({
				title: '提示',
				content: '删除后工位不可恢复,确定继续?',
				okText: '确定',
				okType: 'danger',
				onOk() {
					v.tableLoading = true
					DeleteWorkstation(row.Id)
						.then((res) => {
							if (res.IsSuccess) {
								v.query()
								tipMessage.success('删除工位成功')
							} else {
								tipMessage.error(res.Msg)
							}
							v.tableLoading = false
						})
						.catch(() => {
							v.tableLoading = false
						})
				},
				onCancel() {},
			})
		},
		setConfig(row) {
			this.$refs.basicsConfig.openBasicsConfig(
				row.Id,
				'指定工位配置【' + row.Id + '】'
			)
		},
		setGroup(row) {
			this.$refs.setClassifyGroup.openSetClassify(row)
		},
		connectSignalServer() {
			if (this.signalRconnection == null) {
				this.signalRconnection = new signalR.HubConnectionBuilder()
					.withUrl(this.signalUrl)
					//	.withUrl('http://localhost:13513/WorkstationHub')
					//.withUrl('http://47.99.153.221:30080/WorkstationHub')
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
				this.signalRconnection = undefined
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
					.invoke('SetWorkstationId', this.currentLoginWorkstation.Id)
					.catch(function (err) {
						this.currentLoginWorkstation = undefined
						this.wxloginType = ''
						console.log('err：', err)
					})
			} else if (msg.type == 'SetWorkstationId') {
				if (!this.currentLoginWorkstation) {
					return
				}

				if (this.wxloginType == 'qrlogin') {
					console.log('请求二维码登录接口')
					//请求二维码登录接口
					WechatQRLogin(this.currentLoginWorkstation.Id)
						.then((res) => {
							if (res.IsSuccess) {
								this.wxloginVisible = true
								this.$nextTick(() => {
									this.creatQrCode(res.Data.newUrl)
									this.canloginSecond = 180
									this.doCountDown()
									this.countDownIsRun = true
								})
							} else {
								tipMessage.error('请求扫码出错:' + res.Msg)
							}
						})
						.catch(() => {})
				} else if (this.wxloginType == 'pushlogin') {
					console.log('请求推送登录接口')
					//推送登录
					WechatPushLogin(this.currentLoginWorkstation.Id)
						.then((res) => {
							if (res.IsSuccess) {
								tipMessage.success('推送成功,请在手机微信上进行操作')
								this.wxQrloginHandleCancel()
							} else {
								tipMessage.error('推送失败:' + res.Msg)
							}
						})
						.catch(() => {})
				}
			} else if (msg.type == 'LoginSuccessful') {
				console.log('登录成功')
				if (this.currentLoginWorkstation.Uid == msg.data) {
					this.wxQrloginHandleCancel()
					this.query()
				}
			}
		},
		creatQrCode(text) {
			console.log(text)
			console.log(this.$refs.qrCodeUrl)

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
					console.log(this.canloginSecond)
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
		isShowExpireTag(row) {
			// console.log(row)
			if (!row.EndTime) {
				return false
			}
			var nowTime = moment()
			var workEndTime = moment(row.EndTime)

			var duration = moment.duration(workEndTime.diff(nowTime))
			//  console.log('duration', duration)
			return duration._data.days <= 7
		},
		formatEndDate(row) {
			if (!row.EndTime) {
				return ' '
			}
			return moment(row.EndTime).format('YYYY-MM-DD')
		},
		IsCanDelete(row) {
			var isCan = false
			if (row.WxLogStatus == 1) {
				isCan = true
			}
			if (!isCan) {
				if (!row.EndTime) {
					isCan = false
				} else {
					var nowTime = moment()
					var workEndTime = moment(row.EndTime)
					var duration = moment.duration(workEndTime.diff(nowTime))
					console.log('duration', duration)
					isCan = duration._data.days > 0
				}
				console.log('isCan', isCan)
			}
			return isCan
		},
	},
	created() {
		// console.log("params:",	this.$route.query)
		this.form.UserName = this.$route.query.userName
		this.query()
	},
}
</script>

<style lang="scss" scoped>
.workstation {
	.ant-table-body {
		overflow-x: auto !important;
	}
	.setRole-content {
		height: 400px;
		.left-block,
		.btnbox-block,
		.right-block {
			float: left;
			width: 180px;
			height: 400px;
		}
		.left,
		.right {
			width: 180px;
			height: 400px;
			border: 1px solid #ccc;
			overflow: auto;
			.ant-btn-primary {
				margin-bottom: 10px;
			}
		}
		.btnbox-block {
			width: 100px;
			border: 0 none;
		}
	}
	.table.operation button {
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.tip {
		margin-bottom: 10px;
	}
	.WXAvatar {
		width: 80px;
		height: 80px;
	}
	.wxOp button:not(:last-child) {
		margin-bottom: 4px;
	}
	.searchrow {
		margin-bottom: 5px;
	}
	.wxlogin div p {
		padding-left: 24px;
		line-height: 30px;
	}
	.wxlogin img {
		margin-right: auto;
		margin-left: auto;
	}
}
</style>

