<template>
	<div class="user">
		<a-card title="用户列表">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>

				<!-- <a-form-item label="备注">
					<a-input v-model="form.Remark" placeholder="请输入关键词" />
				</a-form-item> -->
				<a-form-item label="发单状态">
					<a-select style="width: 120px" v-model="form.Status">
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="1">开启</a-select-option>
						<a-select-option value="0">关闭</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
			</a-form>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
				<div slot="StationTypeSlot" class="wxOp" slot-scope="row">
					<!-- <a-tag v-if="row.UserLevel == 1" color="blue">淘客</a-tag>
					<a-tag v-else color="blue">代理</a-tag> -->

					{{ !!row.UserLevel == 1 ? '淘客' : '代理' }}
				</div>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					{{ !!row.Status == 1 ? '开启' : '关闭' }}
				</div>
				<div slot="action" class="wxOp" slot-scope="row">
					<a-button type="primary" size="small" @click="updatePwd(row)">修改密码</a-button>
					<a-button type="primary" size="small" @click="setSupplier(row)">设置供应商</a-button>
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
	</div>
</template>

<script>
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import {
	UserList,
	CreatUser,
	UpdateUserStatus,
	UpdateUserRemark,
} from '@/api/kefu/userApi.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'kefuUserList',
	components: {  },
	data() {
		return {
			statusOptions: [
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
			],
			aform: this.$form.createForm(this),
			editform: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 8 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				IsHasSelf: true,
				Remark: '',
				Status: '-1',
				UserName: '',
				pageSize: 10,
				pageNum: 1,
			},
			addInfo: {
				userName: '',
				pwd: '',
				remark: '',
				status: 1,
				TaoBaoSessionId: undefined,
				TaoBaoPid: '',
				TaoBaoRid: '',
				PddSessionId: undefined,
				PddPid: '',
				PddTip: '',
			},
			addRules: {
				userName: [
					'userName',
					{
						rules: [
							{
								required: true,
								message: '用户名不能为空!',
							},
							// {
							// 	min: 6,
							// 	max: 30,
							// 	message: '长度在 6 到 30 个字符',
							// 	trigger: 'blur'
							// }
						],
					},
				],
				pwd: [
					'pwd',
					{
						rules: [
							{
								required: true,
								message: '密码不能为空!',
							},
							// {
							// 	min: 6,
							// 	max: 30,
							// 	message: '长度在 6 到 30 个字符',
							// 	trigger: 'blur'
							// }
						],
					},
				],
				status: [
					'status',
					{
						rules: [
							{
								required: true,
								message: '请设置账号状态!',
							},
						],
					},
				],
				remark: [
					'remark',
					{
						rules: [
							{
								min: 0,
								max: 100,
								message: '长度在不能超过300个字符',
								trigger: 'blur',
							},
						],
					},
				],
				TaoBaoSessionId: [
					'TaoBaoSessionId',
					{
						rules: [
							{
								required: false,
								message: '请选择淘宝联盟授权!',
							},
							// {
							// 	min: 6,
							// 	max: 30,
							// 	message: '长度在 6 到 30 个字符',
							// 	trigger: 'blur'
							// }
						],
					},
				],
				TaoBaoPid: [
					'TaoBaoPid',
					{
						rules: [
							{
								required: false,
								message: '请输入淘宝联盟Pid!',
							},
						],
					},
				],
				TaoBaoRid: [
					'TaoBaoRid',
					{
						rules: [
							{
								required: false,
								message: '请输入淘宝联盟Rid!',
							},
						],
					},
				],
				PddSessionId: [
					'PddSessionId',
					{
						rules: [
							{
								required: false,
								message: '请选择拼多多授权',
							},
						],
					},
				],
				PddPid: [
					'PddPid',
					{
						rules: [
							{
								required: false,
								message: '请输入多多进宝Pid!',
							},
						],
					},
				],
				PddTip: [
					'PddTip',
					{
						rules: [
							{
								required: false,
								message: '请输入拼多多自定义参数!',
							},
						],
					},
				],
			},
			editInfo: {
				id: 0,
				remark: '',
				status: 1,
			},
			columns: [
				{
					title: '序号',
					Key: 'Id',
					width: '100px',
					dataIndex: 'Id',
				},
				{
					title: '用户名',
					Key: 'UserName',
					width: '150px',
					dataIndex: 'UserName',
				},
				{
					title: '用户类型',
					width: '150px',
					scopedSlots: { customRender: 'StationTypeSlot' },
				},
				{
					title: '发单状态',
					key: 'Status',
					width: '150px',
					scopedSlots: { customRender: 'opSwitchStatus' },
				},
				{
					title: '创建时间',
					Key: 'CTime',
					width: '180px',
					dataIndex: 'CTime',
				},
				{
					title: '工位数',
					Key: 'WorkstationCount',
					width: '150px',
					dataIndex: 'WorkstationCount',
				},

				{
					title: '操作',
					width: '150px',
					scopedSlots: { customRender: 'action' },
				},
			],
			visible: false, //添加用户
			editVisible: false, //编辑信息
			editType: 0, //编辑信息
			data: [],
			mydata: [],
			total: 0,
			curUserId: '',
			tableLoading: false,
		}
	},
	methods: {
		query() {
			this.tableLoading = true

			let params = Object.assign({}, this.form)
			params.Status *= 1

			UserList(params)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		queryTk() {
			this.mytableLoading = true
			UserList({
				isSelf: true,
				pageNum: 1,
				pageSize: 20,
			})
				.then((res) => {
					this.mydata = res.Data
					this.mytableLoading = false
				})
				.catch(() => {
					this.mytableLoading = false
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

		updatePwd(row) {
			
		},
		setSupplier(row) {
			
		},
	},
	created() {
		this.query()
	},
}
</script>

<style lang="scss" scoped>
.user {
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
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.tip {
		margin-bottom: 10px;
	}
}
</style>
