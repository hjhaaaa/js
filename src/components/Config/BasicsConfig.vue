<template>
	<a-modal
		:title="showTitle"
		okText="保存"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<a-form :form="form" :model="configModel" ref="form">
			<a-form-item
				v-bind="formItemLayout"
				label="淘宝授权账号"
				prop="TaoBaoSessionId"
			>
				<a-select
					placeholder="请选择淘宝授权账号"
					v-model="configModel.TaoBaoSessionId"
				>
					<a-select-option v-for="d in tbSessionData" :key="d.Id">{{
						d.Name
					}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="淘宝联盟Pid" prop="TaoBaoPid">
				<a-input
					placeholder="淘宝联盟Pid"
					v-model="configModel.TaoBaoPid"
					autocomplete="off"
				/>
			</a-form-item>

			<a-form-item v-bind="formItemLayout" label="淘宝联盟Rid" prop="TaoBaoRid">
				<a-input
					placeholder="淘宝联盟Rid"
					v-model="configModel.TaoBaoRid"
					autocomplete="off"
				/>
			</a-form-item>

			<a-form-item
				v-bind="formItemLayout"
				label="多多进宝授权账号"
				prop="PddSessionId"
			>
				<a-select
					v-model="configModel.PddSessionId"
					placeholder="请选择多多进宝账号"
				>
					<a-select-option v-for="d in pddSessionData" :key="d.Id">{{
						d.Name
					}}</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item v-bind="formItemLayout" label="多多进宝Pid" prop="PddPid">
				<a-input
					placeholder="多多进宝Pid"
					v-model="configModel.PddPid"
					autocomplete="off"
				/>
			</a-form-item>

			<a-form-item
				v-bind="formItemLayout"
				label="拼多多自定义参数"
				prop="PddTip"
			>
				<a-input
					placeholder="拼多多自定义参数"
					v-model="configModel.PddTip"
					autocomplete="off"
				/>
			</a-form-item>

			<a-form-item v-bind="formItemLayout" label="APP邀请码" prop="InviteCode">
				<a-input
					placeholder="APP邀请码"
					v-model="configModel.InviteCode"
					autocomplete="off"
				/>
			</a-form-item>

			<a-form-item v-bind="formItemLayout" label="备注" prop="Remarks">
				<a-input
					placeholder="备注"
					autocomplete="off"
					v-model="configModel.Remarks"
				/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
import {
	SetSendGroupBasicsConfig,
	SetUserBasicsConfig,
	SetWorkstationConfig,
	GetBasicsConfig,
} from '@/api/tk/basicsConfigApi.js'
import { authorizeList } from '@/api/tk/authorizeApi.js'
export default {
	name: 'component-BasicsConfig',
	props: {
		configType: Number, //配置类型 1=用户 2=工位 3=发送群
	},
	data() {
		return {
			configId: 0,
			showTitle: '指定配置',
			form: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 6 },
				},
				wrapperCol: {
					sm: { span: 14 },
				},
			},
			visible: false,
			confirmLoading: false,
			tbSessionData: [
				// { Id: 1, Nick: 'nicheng1', SessionKey: 'tbSessionKeytest1' },
				// { Id: 2, Nick: 'nicheng2', SessionKey: 'tbSessionKeytest2' }
			],
			pddSessionData: [
				// { Id: 1, Nick: 'pddnk1', SessionKey: 'pddSessionKeytest1' },
				// { Id: 2, Nick: 'pddnk2', SessionKey: 'pddSessionKeytest2' }
			],
			configModel: {
				TaoBaoSessionId: undefined,
				TaoBaoPid: '',
				TaoBaoRid: '',
				PddSessionId: undefined,
				PddPid: '',
				PddTip: '',
				InviteCode: '',
				Remarks: '',
			},
			isInit: false,
		}
	},
	methods: {
		openBasicsConfig: function (id, title) {
			if (title) {
				this.showTitle = title
			}
			this.configId = id
			if (!this.isInit) {
				this.getTbSession()
				this.getPddSession()
				this.isInit = true
			}
			this.getConfig()
			this.visible = true
		},
		closeBasicsConfig: function () {
			this.visible = false
		},
		getTbSession() {
			//获取淘宝授权信息
			authorizeList({
				PlatformType: 1,
				PageNum: 1,
				PageSize: 100,
			})
				.then((res) => {
					if (res.IsSuccess) {
						this.tbSessionData = res.Data
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
		},
		getPddSession() {
			//获取拼多多授权信息
			authorizeList({
				PlatformType: 2,
				PageNum: 1,
				PageSize: 100,
			})
				.then((res) => {
					if (res.IsSuccess) {
						this.pddSessionData = res.Data
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
		},
		getConfig() {
			console.log('configType', this.configType)
			console.log('configId', this.configId)
			GetBasicsConfig(this.configId, this.configType)
				.then((res) => {
					if (res.IsSuccess) {
						this.configModel.TaoBaoSessionId = res.Data.TaoBaoSessionId
						this.configModel.TaoBaoPid = res.Data.TaoBaoPid
						this.configModel.TaoBaoRid = res.Data.TaoBaoRid
						this.configModel.PddSessionId = res.Data.PddSessionId
						this.configModel.PddPid = res.Data.PddPid
						this.configModel.PddTip = res.Data.PddTip
						// this.configModel.JDSessionId = res.Data.JDSessionId
						// this.configModel.JDPid = res.Data.JDPid
						// this.configModel.JDTip = res.Data.JDTip

						this.configModel.InviteCode = res.Data.InviteCode
						this.configModel.Remarks = res.Data.Remarks
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
		},
		setUser() {
			var config = this.configModel
			config.UserId = this.configId
			SetUserBasicsConfig(config)
				.then((res) => {
					if (res.IsSuccess) {
						this.$message.success('保存成功')
						this.closeBasicsConfig()
					} else {
						notification.error({
							message: '错误',
							description: '保存出错:' + res.Data,
						})
					}
					this.confirmLoading = false
				})
				.catch(() => {
					this.confirmLoading = false
				})
		},
		setWorkstation() {
			var config = this.configModel
			config.WorkstationId = this.configId
			SetWorkstationConfig(config)
				.then((res) => {
					if (res.IsSuccess) {
						this.$message.success('保存成功')
						this.closeBasicsConfig()
					} else {
						notification.error({
							message: '错误',
							description: '保存出错:' + res.Data,
						})
					}
					this.confirmLoading = false
				})
				.catch(() => {
					this.confirmLoading = false
				})
		},
		setSendGroup() {
			var config = this.configModel
			config.GroupId = this.configId
			SetSendGroupBasicsConfig(config)
				.then((res) => {
					if (res.IsSuccess) {
						this.$message.success('保存成功')
						this.closeBasicsConfig()
					} else {
						notification.error({
							message: '错误',
							description: '保存出错:' + res.Data,
						})
					}
					this.confirmLoading = false
				})
				.catch(() => {
					this.confirmLoading = false
				})
		},
		handleOk() {
			this.confirmLoading = true
			if (this.configType == 1) {
				this.setUser()
			} else if (this.configType == 2) {
				this.setWorkstation()
			} else if (this.configType == 3) {
				this.setSendGroup()
			} else {
				console.log('暂不支持该类型')
			}
		},
		handleCancel() {
			this.closeBasicsConfig()
		},
	},
}
</script>