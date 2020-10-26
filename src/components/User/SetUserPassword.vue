<template>
	<a-modal
		v-model="visible"
		title="设置密码"
		ok-text="确认"
		cancel-text="取消"
		@ok="setPwdHandleOk"
	>
		<a-form
			:form="setPwdForm"
			:model="setPwdFormModel"
			:rules="setPwdRules"
			ref="setPwdForm"
		>
			<a-form-item v-bind="formItemLayout" label="用户名">
				<a-input
					placeholder="登录用户名"
					:read-only="true"
					v-model="setPwdFormModel.userName"
				/>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="密码" prop="pwd">
				<a-input-password
					placeholder="登录密码"
					autocomplete="new-password"
					v-decorator="setPwdRules.pwd"
				/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import tipMessage from '@/utils/messageUtil.js'
import { SetUserPassword as SetUserPasswordApi } from '@/api/tk/userApi.js'
import { SetAdminPassword } from '@/api/admin/accountApi.js'
export default {
	name: 'SetUserPasswordComponent',
	props: {
		platformType: Number, //目标类型  1=淘客 2=管理员
	},
	data() {
		return {
			showTitle: '设置密码',
			setPwdForm: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 8 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			visible: false,
			other: undefined,
			confirmLoading: false,
			nowSetPwdRow: undefined,
			setPwdFormModel: {
				userName: '',
				pwd: undefined,
			},
			setPwdRules: {
				pwd: [
					'pwd',
					{
						rules: [
							{
								required: true,
								message: '密码不能为空!',
							},
							{
								pattern: /^[a-zA-Z0-9]{4,16}$/g,
								message: '密码必须为4-16位的字母数字',
							},
						],
					},
				],
			},
		}
	},
	methods: {
		openUpdatePwd: function (row, other) {
			this.other = other
			this.nowSetPwdRow = row
			this.confirmLoading = true
			;(this.setPwdFormModel.userName = row.UserName),
				this.$nextTick(() => {
					this.setPwdForm.setFieldsValue({
						pwd: 'mg123456',
					})
				})
			this.visible = true
		},
		closeUpdatePwd: function () {
			this.visible = false
		},
		setPwdHandleOk() {
			this.setPwdForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log('setPwdForm values: ', values)
					console.log('platformType', this.platformType)
					if (this.platformType == 1) {
						SetUserPasswordApi(this.nowSetPwdRow.Id, values.pwd)
							.then((res) => {
								this.editSuccess()
							})
							.catch(() => {})
					} else if (this.platformType == 2) {
						SetAdminPassword(this.nowSetPwdRow.Id, values.pwd)
							.then((res) => {
								this.editSuccess()
							})
							.catch(() => {})
					} else {
						console.log('无效类型')
					}
					this.confirmLoading = false
				}
			})
		},
		editSuccess() {
			this.nowSetPwdRow = undefined
			tipMessage.success('设置密码成功')
			this.visible = false
			this.$emit('onSuccess', this.other)
		},
		handleCancel() {
			this.closeUpdatePwd()
		},
		created() {},
	},
}
</script>