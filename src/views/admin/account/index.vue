<template>
	<div class="user">
		<a-card title="管理员列表">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>

				<a-form-item label="备注">
					<a-input v-model="form.Remarks" placeholder="请输入关键词" />
				</a-form-item>
				<a-form-item label="角色">
					<a-select
						style="width: 100px"
						v-model="form.RoleId"
						:options="searchRoleOptions"
					>
					</a-select>
				</a-form-item>
				<a-form-item label="账号状态">
					<a-select style="width: 100px" v-model="form.Status">
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="1">启用</a-select-option>
						<a-select-option value="0">禁用</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
					<a-button
						type="primary"
						style="margin-left: 15px"
						icon="plus-circle"
						@click="addAdmin"
						>添加</a-button
					>
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
				<div slot="StatusSlot" slot-scope="row">
					{{ !!row.Status ? '启用' : '禁用' }}
				</div>
				<div slot="action" class="table operation" slot-scope="row">
					<a-button type="primary" size="small" @click="editAdmin(row)"
						>编辑</a-button
					>
					<a-button type="primary" size="small" @click="updatePwd(row)"
						>修改密码</a-button
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

			<a-modal
				v-model="addVisible"
				title="添加管理员"
				ok-text="确认"
				cancel-text="取消"
				@ok="addHandleOk"
			>
				<a-form :form="addForm" :rules="addRules" ref="addForm">
					<a-form-item v-bind="formItemLayout" label="用户名" prop="userName">
						<a-input placeholder="登录用户名" v-decorator="addRules.userName" />
					</a-form-item>
					<a-form-item v-bind="formItemLayout" label="密码" prop="pwd">
						<a-input-password
							placeholder="登录密码"
							autocomplete="new-password"
							v-decorator="addRules.pwd"
						/>
					</a-form-item>
					<a-form-item v-bind="formItemLayout" label="角色" prop="roleId">
						<a-select v-decorator="addRules.roleId" :options="roleOptions">
						</a-select>
					</a-form-item>
					<a-form-item v-bind="formItemLayout" label="状态" prop="status">
						<a-radio-group v-decorator="addRules.status">
							<a-radio :value="1"> 启用</a-radio>
							<a-radio :value="0"> 禁用</a-radio>
						</a-radio-group>
					</a-form-item>

					<a-form-item v-bind="formItemLayout" label="备注" prop="remarks">
						<a-textarea
							placeholder="备注信息"
							v-decorator="addRules.remarks"
							:rows="4"
						/>
					</a-form-item>
				</a-form>
			</a-modal>

			<a-modal
				v-model="editVisible"
				title="编辑管理员"
				ok-text="确认"
				cancel-text="取消"
				@ok="editHandleOk"
			>
				<a-form :form="editForm" :rules="editRules" ref="editForm">
					<a-form-item v-bind="formItemLayout" label="id" prop="id">
						<a-input
							placeholder="id"
							v-decorator="editRules.id"
							:read-only="true"
						/>
					</a-form-item>
					<a-form-item v-bind="formItemLayout" label="用户名" prop="userName">
						<a-input
							placeholder="登录用户名"
							v-decorator="editRules.userName"
							:read-only="true"
						/>
					</a-form-item>

					<a-form-item v-bind="formItemLayout" label="角色" prop="roleId">
						<a-select v-decorator="editRules.roleId" :options="roleOptions">
						</a-select>
					</a-form-item>
					<a-form-item v-bind="formItemLayout" label="状态" prop="status">
						<a-radio-group v-decorator="editRules.status">
							<a-radio :value="1"> 启用</a-radio>
							<a-radio :value="0"> 禁用</a-radio>
						</a-radio-group>
					</a-form-item>

					<a-form-item v-bind="formItemLayout" label="备注" prop="remarks">
						<a-textarea
							placeholder="备注信息"
							v-decorator="editRules.remarks"
							:rows="4"
						/>
					</a-form-item>
				</a-form>
			</a-modal>

			<SetUserPasswordCom
				:platformType="2"
				ref="setUserPassword"
				@onSuccess="setUserPasswordSuccess"
			></SetUserPasswordCom>
		</a-card>
	</div>
</template>

<script>
import moment from 'moment'
import SetUserPasswordCom from '@/components/User/SetUserPassword.vue'
import tipMessage from '@/utils/messageUtil.js'
import {
	AdminList,
	CreateAdmin,
	EditAdmin,
	DeleteAdmin,
} from '@/api/admin/accountApi.js'
import { RoleList } from '@/api/admin/roleApi.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'adminAccountList',
	components: { SetUserPasswordCom },
	data() {
		return {
			statusOptions: [
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
			],
			setPwdForm: this.$form.createForm(this),

			formItemLayout: {
				labelCol: {
					sm: { span: 8 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				RoleId: -1,
				Remarks: '',
				Status: '-1',
				UserName: '',
				pageSize: 10,
				pageNum: 1,
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
					title: '账号状态',
					width: '100px',
					scopedSlots: { customRender: 'StatusSlot' },
				},
				{
					title: '备注',
					width: '150px',
					dataIndex: 'Remarks',
				},
				{
					title: '创建时间',
					Key: 'CTime',
					width: '180px',
					dataIndex: 'CTime',
				},
				{
					title: '操作',
					width: '150px',
					scopedSlots: { customRender: 'action' },
				},
			],
			data: [],
			mydata: [],
			total: 0,
			curUserId: '',
			tableLoading: false,
			setPwdVisible: false,
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
			other: '',
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
			addForm: this.$form.createForm(this),
			addVisible: false,
			addFormModel: {
				id: 0,
				userName: '',
				pwd: '',
				remarks: '',
				status: '1',
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
							{
								pattern: /^[a-zA-Z0-9]{4,16}$/g,
								message: '密码必须为4-16位的字母数字',
							},
						],
					},
				],
				status: [
					'status',
					{
						rules: [
							{
								required: true,
								message: '请设置状态!',
							},
						],
					},
				],
				roleId: [
					'roleId',
					{
						rules: [
							{
								required: true,
								message: '请选择角色!',
							},
						],
					},
				],
				remarks: [
					'remarks',
					{
						rules: [
							{
								required: false,
								message: '请设置状态!',
							},
						],
					},
				],
			},
			isLoadRole: false,
			roleOptions: [
				// { label: '未充值', value: 0 }
			],
			searchRoleOptions: [{ label: '全部', value: -1 }],
			editForm: this.$form.createForm(this),
			editVisible: false,
			editFormModel: {
				id: 0,
				userName: '',
				remarks: '',
				status: '1',
			},
			editRules: {
				id: [
					'id',
					{
						rules: [
							{
								required: true,
								message: '请设置状态!',
							},
						],
					},
				],
				userName: [
					'userName',
					{
						rules: [
							{
								required: true,
								message: '用户名不能为空!',
							},
						],
					},
				],
				status: [
					'status',
					{
						rules: [
							{
								required: true,
								message: '请设置状态!',
							},
						],
					},
				],
				roleId: [
					'roleId',
					{
						rules: [
							{
								required: true,
								message: '请选择角色!',
							},
						],
					},
				],
				remarks: [
					'remarks',
					{
						rules: [
							{
								required: false,
								message: '请设置状态!',
							},
						],
					},
				],
			},
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			let params = Object.assign({}, this.form)
			params.Status *= 1
			params.RoleId *= 1
			AdminList(params)
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
		updatePwd(row) {
			this.$refs.setUserPassword.openUpdatePwd(row)
		},
		addHandleOk() {
			this.addForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					// console.log('addForm values: ', values)
					CreateAdmin(values)
						.then((res) => {
							this.query()
							tipMessage.success('添加成功')
							this.addVisible = false
						})
						.catch(() => {})
					this.tableLoading = false
				}
			})
		},
		addAdmin() {
			this.addVisible = true
			// if (!this.isLoadRole) {
			// 	this.getRoleList()
			// }

			this.$nextTick(() => {
				this.addForm.setFieldsValue({
					userName: '',
					pwd: '',
					status: 1,
					roleId: 2,
					remarks: '',
				})
			})
		},
		editAdmin(row) {
			this.editVisible = true
			this.$nextTick(() => {
				this.editForm.setFieldsValue({
					id: row.Id,
					userName: row.UserName,
					status: row.Status,
					remarks: row.Remarks,
					roleId: row.RoleId,
				})
			})
		},
		editHandleOk() {
			this.editForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					EditAdmin(values)
						.then((res) => {
							this.query()
							tipMessage.success('修改成功')
							this.editVisible = false
						})
						.catch(() => {})
					this.tableLoading = false
				}
			})
		},
		getRoleList() {
			var params = {
				pageNo: 1,
				pageSize: 1000,
			}
			var $this = this
			RoleList(params)
				.then((res) => {
					for (let index = 0; index < res.Data.length; index++) {
						const item = res.Data[index]
						$this.roleOptions.push({
							label: item.RoleName,
							value: item.Id,
						})
						$this.searchRoleOptions.push({
							label: item.RoleName,
							value: item.Id,
						})
					}

					console.log('roleOptions', roleOptions)
				})
				.catch(() => {})
		},
		setUserPasswordSuccess(obj) {
			this.query()
		},
	},
	created() {
		this.getRoleList()
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
