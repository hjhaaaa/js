<template>
	<div class="classifygroup">
		<a-card title="分组管理" :bordered="false">
			<a-form layout="inline" style="margin-bottom: 10px">
				<a-form-item label="开启分组">
					<a-switch
						checked-children="开"
						un-checked-children="关"
						:checked="classifyGroupStatus"
						@change="classifyGroupStatusChange"
					/>开启分组后，可以自由配置发单方案。查看教程
				</a-form-item>
			</a-form>
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="分组名称">
					<a-input v-model="form.Name" placeholder="请输入分组名称" />
				</a-form-item>
				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
				<a-form-item>
					<a-button type="primary" icon="plus-circle" @click="add"
						>添加分组</a-button
					>
				</a-form-item>
			</a-form>

			<a-table
				:bordered="true"
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
				<div class="table operation" slot="action" slot-scope="row">
					<a type="link" @click="edit(row)">编辑</a>
					<a type="link" :disabled="isCanDel(row)" @click="remove(row)">删除</a>
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
			:title="editTitle"
			:visible="editVisible"
			:closable="false"
			@ok="editHandleOk"
			@cancel="editHandleCancel"
			:confirm-loading="editConfirmLoading"
		>
			<a-form :form="editForm" :model="editInfo" ref="editForm">
				<a-form-item v-bind="formItemLayout" label="分组名称">
					<a-input
						placeholder="请输入分组名称"
						v-model="editInfo.Name"
						autocomplete="off"
					/>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="是否转链">
					<a-radio-group v-model="editInfo.IsNeedTLinkValue">
						<a-radio :value="1">是</a-radio>
						<a-radio :value="0">否</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="分组介绍">
					<a-textarea
						placeholder="分组介绍"
						v-model="editInfo.GroupInfo"
						autocomplete="off"
						:rows="3"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import { GetLoginUserInfo } from '@/api/tk/userApi.js'
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
import {
	ClassifyGroupList,
	EditClassifyGroup,
	DeleteClassifyGroup,
	OpenCollectionGroupClassify,
} from '@/api/tk/classGroupApi.js'

export default {
	name: 'classifygroup',
	components: {},
	data() {
		return {
			statusOptions: [
				{ label: '全部', value: 'all' },
				{ label: '启用', value: '1' },
				{ label: '禁用', value: '0' },
				{ label: '三天内到期', value: '2' },
			],
			wxStatusOptions: [
				{ label: '全部', value: 'all' },
				{ label: '在线', value: '1' },
				{ label: '离线', value: '0' },
			],
			aform: this.$form.createForm(this),
			editForm: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				Name: '',
				pageSize: 20,
				pageNum: 1,
			},
			columns: [
				// {
				// 	title: '分组信息',
				// 	children: [
				{
					title: '序号',
					width: '80px',
					dataIndex: 'Id',
				},
				{
					title: '分组名称',
					Key: 'Name',
					width: '200px',
					dataIndex: 'Name',
				},
				{
					title: '分组介绍',
					Key: 'GroupInfo',
					width: '200px',
					dataIndex: 'GroupInfo',
				},
				{
					title: '创建时间',
					Key: 'CTime',
					width: '150px',
					dataIndex: 'CTime',
				},
				// ],
				// },
				{
					title: '使用数量',
					children: [
						{
							title: '采集对象',
							width: '100px',
							dataIndex: 'CollectionCount',
						},
						{
							title: '用户',
							width: '100px',
							dataIndex: 'UserCount',
						},
						{
							title: '工位',
							width: '100px',
							dataIndex: 'WorkstationCount',
						},
						{
							title: '发送群',
							width: '100px',
							dataIndex: 'SendGroupCount',
						},
					],
				},

				{
					title: '操作',
					scopedSlots: { customRender: 'action' },
				},
			],
			visible: false, //添加用户
			data: [],
			total: 0,
			tableLoading: false,
			editTitle: '添加分组',
			editVisible: false, //充值页面
			editButtonDisabled: null, //确定充值按钮可用状态
			editButtonLoading: false,
			editInfo: {
				Id: 0,
				IsNeedTLinkValue: 1,
				GroupInfo: '',
				Name: '',
			},
			classifyGroupStatus: false,
			editConfirmLoading: false,
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			ClassifyGroupList(this.form)
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
		classifyGroupStatusChange(checked) {
			OpenCollectionGroupClassify(checked)
				.then((res) => {
					if (res.IsSuccess) {
						tipMessage.success('操作成功')
						this.classifyGroupStatus = checked
						//	this.query();
						//this.editVisible = false
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
		},
		add() {
			this.editInfo.Id = 0
			this.editInfo.IsNeedTLinkValue = 1
			this.editInfo.Name = ''
			this.editInfo.GroupInfo = ''
			this.editVisible = true
			this.editTitle = '添加分组'
		},
		edit(row) {
			this.editInfo.Id = row.Id
			this.editInfo.Name = row.Name
			this.editInfo.GroupInfo = row.GroupInfo
			this.editInfo.IsNeedTLinkValue = row.IsNeedTLink ? 1 : 0
			this.editVisible = true
			this.editTitle = `编辑分组${row.Id}`
		},
		remove(row) {
			var $this = this
			// tipMessage.confirmDelete(undefined, function() {
			// 	tipMessage.success('ok')
			// })
			this.tableLoading = true
			this.$confirm({
				title: '提示',
				content: '删除后不可恢复,确定删除？',
				okText: '确定',
				okType: 'danger',
				onOk() {
					DeleteClassifyGroup(row.Id)
						.then((res) => {
							if (res.IsSuccess) {
								tipMessage.success('操作成功')
								$this.query()
								$this.tableLoading = false
							} else {
								tipMessage.error(res.Msg)
								$this.tableLoading = false
							}
						})
						.catch(() => {})
				},
				onCancel() {
					//tipMessage.error('ok')
					this.tableLoading = false
				},
			})
		},
		editHandleCancel() {
			this.editVisible = false
		},
		editHandleOk() {
			console.log('editHandleOk')
			var pram = {
				ClassifyName: this.editInfo.Name,
				IsNeedTLink: this.editInfo.IsNeedTLinkValue == 1,
				GroupInfo: this.editInfo.GroupInfo,
				Id: this.editInfo.Id,
			}
			this.editConfirmLoading = true
			EditClassifyGroup(pram)
				.then((res) => {
					console.log('res')
					if (res.IsSuccess) {
						tipMessage.success('操作成功')
						this.query()
						this.editVisible = false
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
			this.editConfirmLoading = false
		},
		getLoginUserInfo() {
			GetLoginUserInfo()
				.then((res) => {
					this.classifyGroupStatus = res.Data.IsUseGroup
				})
				.catch(() => {})
		},
		isCanDel(row) {
			//console.log(row)
			var isCanDel = false
			if (
				row.CollectionCount > 0 ||
				row.UserCount > 0 ||
				row.WorkstationCount > 0 ||
				row.SendGroupCount > 0
			) {
				isCanDel = true
			}

			return isCanDel
		},
	},
	created() {
		this.getLoginUserInfo()
		this.query()
	},
}
</script>

<style lang="scss" scoped>
.classifygroup {
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
	.table.operation a {
		padding-right: 10px;
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
}
</style>
