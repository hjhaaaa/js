<template>
	<div>
		<a-card title="分组管理" :bordered="false">
			<a-form layout="inline" style="margin-bottom: 10px">
				<a-form-item label="开启分组">
					<a-switch
						checked-children="开"
						un-checked-children="关"
						:checked="ClassifyGroupStatus"
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
					<a-button type="primary" icon="plus-circle" @click="add">添加分组</a-button>
				</a-form-item>
			</a-form>

			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
			>
				<div class="table operation" slot="action" slot-scope="row">
					<a type="link" @click="edit(row)">编辑</a>
					<a type="link" @click="remove(row)">删除</a>
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
					:showTotal="total => `共${total}条`"
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
					<a-input placeholder="请输入分组名称" v-model="editInfo.Name" autocomplete="off" />
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="是否转链">
					<a-radio-group v-model="editInfo.IsNeedTLinkValue">
						<a-radio :value="1">是</a-radio>
						<a-radio :value="0">否</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="分组介绍">
					<a-textarea placeholder="分组介绍" v-model="editInfo.GroupInfo" autocomplete="off" :rows="3" />
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import {
	WechatQRLogin,
	WechatLogout,
	WechatPushLogin
} from '@/api/wechatApi.js'
import {
	SendGroupList,
	DeleteSendGroup,
	UpdateSendGroupStatus,
	UpdateSendGroupRemark
} from '@/api/sendGroupApi.js'
import { GetRechargeCode, RechargeWorkstation } from '@/api/cardCodeApi.js'
import { constants } from 'zlib'
import { callbackify, log } from 'util'
import { deeppink } from 'color-name'
import {
	ClassifyGroupList,
	EditClassifyGroup,
	DeleteClassifyGroup
} from '@/api/classGroupApi.js'

export default {
	name: 'classifygroup',
	components: {},
	data() {
		return {
			statusOptions: [
				{ label: '全部', value: 'all' },
				{ label: '启用', value: '1' },
				{ label: '禁用', value: '0' },
				{ label: '三天内到期', value: '2' }
			],
			wxStatusOptions: [
				{ label: '全部', value: 'all' },
				{ label: '在线', value: '1' },
				{ label: '离线', value: '0' }
			],
			aform: this.$form.createForm(this),
			editForm: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 }
				},
				wrapperCol: {
					sm: { span: 12 }
				}
			},
			form: {
				Name: '',
				pageSize: 20,
				pageNum: 1
			},
			columns: [
				{
					title: '序号',
					width: '150px',
					dataIndex: 'Id'
				},
				{
					title: '分组名称',
					Key: 'Name',
					width: '200px',
					dataIndex: 'Name'
				},
				{
					title: '分组介绍',
					Key: 'GroupInfo',
					width: '30%',
					dataIndex: 'GroupInfo'
				},

				{
					title: '创建时间',
					Key: 'CTime',
					width: '200px',
					dataIndex: 'CTime'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'action' }
				}
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
				Name: ''
			},
			ClassifyGroupStatus: false,
			editConfirmLoading: false
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			ClassifyGroupList(this.form)
				.then(res => {
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
			this.classifyGroupStatusChange = checked
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

			this.$confirm({
				title: '提示',
				content: '确定删除？',
				okText: '确定',
				okType: 'danger',
				onOk() {
					tipMessage.success('操作成功')
				},
				onCancel() {
					//tipMessage.error('ok')
				}
			})
		},
		editHandleCancel() {
			this.editVisible = false
		},
		editHandleOk() {
			var pram = {
				ClassifyName: this.editInfo.Name,
				IsNeedTLink: this.editInfo.IsNeedTLinkValue == 1,
				GroupInfo: this.editInfo.GroupInfo,
				Id: this.editInfo.Id
			}
			this.editConfirmLoading = true
			EditClassifyGroup(pram)
				.then(res => {
					if (res.IsSuccess) {
						tipMessage.success('操作成功')
						this.query();
						this.editVisible = false
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
			this.editConfirmLoading = false
		}
	},
	created() {
		this.query()
	}
}
</script>

<style lang="scss" scoped>
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
</style>
