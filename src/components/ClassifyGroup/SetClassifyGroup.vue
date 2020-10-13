<template>
	<a-modal
		:title="showTitle"
		okText="保存"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<a-form :form="form" :model="eidtModel" ref="form">
			<a-form-item v-bind="formItemLayout" :label="eidtModel.targetIdLable">
				<a-input v-model="eidtModel.targetId" autocomplete="off" read-only />
			</a-form-item>

			<a-form-item v-bind="formItemLayout" label="备注">
				<a-input v-model="eidtModel.remarks" autocomplete="off" read-only />
			</a-form-item>
			<!-- v-model="eidtModel.classifyId"  prop="classifyId" v-decorator="['classifyId',{ rules: [{ required: true, message: '请选择分组!' }] }]" -->
			<a-form-item v-bind="formItemLayout" label="指定分组">
				<a-select placeholder="请选择分组" v-model="eidtModel.classifyId">
					<a-select-option v-for="d in ClassifyList" :key="d.Id">{{ d.Name }}</a-select-option>
				</a-select>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import tipMessage from '@/utils/messageUtil.js'
import {
	ClassifyGroupList,
	GetTargetClassify,
	SetTargetClassify
} from '@/api/classGroupApi.js'
export default {
	name: 'component-SetClassifyGroup',
	props: {
		targetType: Number //目标类型  2=工位 3=发送群
	},
	data() {
		return {
			targetId: 0,
			showTitle: '指定分组',
			form: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 6 }
				},
				wrapperCol: {
					sm: { span: 14 }
				}
			},
			visible: false,
			confirmLoading: false,
			ClassifyList: [
				// { Id: 1, Nick: 'nicheng1', SessionKey: 'tbSessionKeytest1' },
				// { Id: 2, Nick: 'nicheng2', SessionKey: 'tbSessionKeytest2' }
			],
			eidtModel: {
				targetIdLable: '工位Id',
				sendGroupName: undefined,
				remarks: '',
				classifyId: undefined,
				targetId: 0
			},
			isInit: false,
			isUser: this.targetType == 1,
			isWorkstatsion: this.targetType == 2,
			isSendGroup: this.targetType == 3
		}
	},
	methods: {
		openSetClassify: function(row) {
			console.log(row, this.isSendGroup)
			if (this.isUser) {
				this.eidtModel.targetIdLable = '用户名'
				this.eidtModel.remarks = row.Remarks
				this.eidtModel.targetId = row.UserName
			} else if (this.isWorkstatsion) {
				this.eidtModel.targetIdLable = '工位Id'
				this.eidtModel.remarks = row.Remarks
				this.eidtModel.targetId = row.Id
			} else if (this.isSendGroup) {
				this.eidtModel.targetIdLable = '群名称'
				this.eidtModel.targetId = row.GroupName
			}
			this.targetId = row.Id

			if (!this.isInit) {
				this.getClassifyList()
				this.isInit = true
			}
			this.getClassify()
			this.visible = true
		},
		closeSetClassify: function() {
			this.visible = false
		},
		getClassifyList() {
			var params = {
				PageNum: 1,
				PageSize: 1000
			}
			ClassifyGroupList(params)
				.then(res => {
					if (res.IsSuccess) {
						this.ClassifyList = res.Data
					} else {
						tipMessage.error('获取出错:' + res.Data)
					}
				})
				.catch(() => {})
		},
		getClassify() {
			console.log('获取当前目标分组信息')
			GetTargetClassify(this.targetType, this.targetId)
				.then(res => {
					this.eidtModel.classifyId = res.Data == null ? undefined : res.Data
				})
				.catch(() => {})
		},
		handleOk() {
			this.confirmLoading = true
			if (this.eidtModel.classifyId<=0) {
				tipMessage.error("请选择分组!")
				return
			}
			SetTargetClassify(
				this.targetType,
				this.targetId,
				this.eidtModel.classifyId
			)
				.then(res => {
					if (res.IsSuccess) {
						tipMessage.success('保存成功')
						this.closeSetClassify()
					} else {
						tipMessage.error('保存出错:' + res.Data)
					}
				})
				.catch(() => {})
			this.confirmLoading = false
		},
		handleCancel() {
			this.closeSetClassify()
		},
		created() {}
	}
}
</script>