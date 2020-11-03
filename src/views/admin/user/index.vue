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
					{{ !!row.UserLevel == 1 ? '淘客' : '代理' }}
				</div>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					{{ !!row.Status == 1 ? '开启' : '关闭' }}
				</div>
				<div slot="IsSupplierSlot" class="wxOp" slot-scope="row">
					{{ !!row.IsSupplier ? '供应商' : '淘客' }}
				</div>
				<div slot="action" class="table operation" slot-scope="row">
					<a-button type="primary" size="small" @click="updatePwd(row)"
						>修改密码</a-button
					>
					<a-button
						type="primary"
						size="small"
						@click="setSupplier(row)"
						:disabled="row.IsSupplier||row.SupplierId>0"
						>成为供应商</a-button
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
import { UserList, SetUserSupplier } from '@/api/admin/userApi.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'adminUserList',
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
				IsHasSelf: true,
				Remark: '',
				Status: '-1',
				UserName: '',
				pageSize: 20,
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
				// {
				// 	title: '用户类型',
				// 	width: '100px',
				// 	scopedSlots: { customRender: 'StationTypeSlot' },
				// },
				{
					title: '用户类型',
					width: '100px',
					scopedSlots: { customRender: 'IsSupplierSlot' },
				},
				{
					title: '发单状态',
					key: 'Status',
					width: '100px',
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
			data: [],
			mydata: [],
			total: 0,
			curUserId: '',
			tableLoading: false,
			setPwdVisible: false,
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
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
			this.$refs.setUserPassword.openUpdatePwd(row)
		},

		setSupplier(row) {
			let v = this //保存外层this对象
			//删除工位
			this.$confirm({
				title: '提示',
				content: `确定将用户【${row.Id}】设置为供应商?`,
				okText: '确定',
				okType: 'danger',
				onOk() {
					v.tableLoading = true
					SetUserSupplier(row.Id)
						.then((res) => {
							if (res.IsSuccess) {
								v.query()
								tipMessage.success('设置成功')
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
		setUserPasswordSuccess(obj) {
			// console.log('setUserPasswordSuccess')
			this.query()
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
