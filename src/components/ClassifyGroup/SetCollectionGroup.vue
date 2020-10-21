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
			<a-form-item v-bind="formItemLayout" label="工位id">
				<a-input v-model="eidtModel.WorkstationId" autocomplete="off" read-only />
			</a-form-item>

			<a-form-item v-bind="formItemLayout" label="群名称">
				<a-input v-model="eidtModel.GroupName" autocomplete="off" read-only />
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="采集对象昵称">
				<a-input v-model="eidtModel.FromNickName" autocomplete="off" read-only />
			</a-form-item>

			<!-- <a-form-item v-bind="formItemLayout" label="备注">
				<a-input v-model="eidtModel.remarks" autocomplete="off" read-only />
			</a-form-item>-->
			<!-- v-model="eidtModel.classifyId"  prop="classifyId" v-decorator="['classifyId',{ rules: [{ required: true, message: '请选择分组!' }] }]" -->
			<a-form-item v-bind="formItemLayout" label="指定分组">
				<!-- <a-select placeholder="请选择分组" v-model="eidtModel.classifyId">
					<a-select-option v-for="d in ClassifyList" :key="d.Id">{{ d.ClassifyName }}</a-select-option>
				</a-select>      @change="onChange"
				:style="{ borderBottom: '1px solid #E9E9E9' }"
				-->
				<div>
					<a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">全选</a-checkbox>
				</div>
				<a-checkbox-group
					v-model="classifyIds"
					name="classifyIds"
					:options="options"
					@change="onCheckChange"
				/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import tipMessage from '@/utils/messageUtil.js'
import {
	ClassifyGroupList,
	GetTargetClassify,
	SetCollectionGroupClassify,
	GetCollectionGroupClassify
} from '@/api/tk/classGroupApi.js'
export default {
	name: 'component-SetCollectionGroup', //设置采集分组组件
	props: {},
	data() {
		return {
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
			options: [
				// { label: '还是东方红士大夫是', value: 'Apple1' },
				// { label: 'Pear1', value: 'Pear1' },
				// { label: '全部分组', value: 0 },
			],
			optionsCheckAll: [],
			eidtModel: {},
			targetId: 0,
			classifyIds: [],
			isInit: false,
			indeterminate: false,
			checkAll: false
		}
	},
	methods: {
		openSetClassify: function(row) {
			this.eidtModel.GroupName = row.GroupName
			this.eidtModel.WorkstationId = row.WorkstationId
			this.eidtModel.FromNickName = row.FromNickName
			this.targetId = row.Id

			if (!this.isInit) {
				this.getClassifyList()
				this.isInit = true
			}
			this.getClassify()
			this.checkAll = false
			this.classifyIds = []
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
						var _options = this.options
						var _optionsCheckAll = this.optionsCheckAll
						res.Data.forEach(function(row) {
							_options.push({
								label: row.Name,
								value: row.Id
							})
							_optionsCheckAll.push(row.Id)
						})

						console.log('options', this.options)
					} else {
						tipMessage.error('获取出错:' + res.Data)
					}
				})
				.catch(() => {})
		},
		getClassify() {
			console.log('获取当前目标分组信息')
			GetCollectionGroupClassify(this.targetId)
				.then(res => {
					console.log('res', res)
					this.classifyIds = res.Data
					if (
						res.Data.length > 0 &&
						res.Data.length == this.optionsCheckAll.length
					) {
						this.checkAll = true
					} else {
						this.indeterminate = res.Data.length > 0
					}
				})
				.catch(() => {})
		},
		handleOk() {
			console.log('保存设置')

			if (this.classifyIds.length <= 0) {
				tipMessage.error('请选择分组!')
				return
			}
			this.confirmLoading = true
			var params = {
				Id: this.targetId,
				ClassifyIds: this.classifyIds
			}
			// console.log("pram",params)
			SetCollectionGroupClassify(params)
				.then(res => {
					if (res.IsSuccess) {
						tipMessage.success('保存成功')
						this.closeSetClassify()
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
			this.confirmLoading = false
		},
		handleCancel() {
			this.closeSetClassify()
		},
		onCheckAllChange(e) {
			console.log(e)
			Object.assign(this, {
				classifyIds: e.target.checked ? this.optionsCheckAll : [],
				indeterminate: false,
				checkAll: e.target.checked
			})
		},
		onCheckChange(values) {
			if (values.length > 0) {
				this.checkAll = values.length == this.optionsCheckAll
				this.indeterminate = !this.checkAll
			} else {
				this.checkAll = false
				this.indeterminate = false
			}
		},
		created() {}
	}
}
</script>
<style lang="scss" >
.ant-checkbox-group-item {
	width: 120px;
}
</style>