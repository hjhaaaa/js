<template>
	<div class="user">
		<a-card title="推广列表" style="margin-top: 10px">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>

				<a-form-item label="开始日期">
					<a-date-picker
						v-model="form.startDate"
						valueFormat="YYYY-MM-DD"
						placeholder="开始日期"
					/>
				</a-form-item>
				<a-form-item label="结束日期">
					<a-date-picker v-model="form.endDate" format="YYYY-MM-DD" placeholder="结束日期" />
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
				:scroll="{ x: 300 }"
			>
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
import { SupplierTkList } from '@/api/tk/userApi.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'user',
	components: {},
	data() {
		return {
			aform: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 8 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				userName: '',
				startDate: undefined,
				endDate: undefined,
				pageSize: 20,
				pageNum: 1,
			},
			columns: [
				{
					title: '序号',
					width: '80px',
					dataIndex: 'Id',
				},
				{
					title: '用户名',
					width: '150px',
					dataIndex: 'UserName',
				},
				{
					title: '注册时间',
					width: '150px',
					dataIndex: 'CTime',
				},
			],
			data: [],
			mydata: [],
			total: 0,
			tableLoading: false,
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			let params = Object.assign({}, this.form)
			if (params.startDate) {
				let startDate = params.startDate
				params.startDate = moment(startDate).format('YYYY-MM-DD')
			} else {
				params.startDate = null
			}
			if (params.endDate) {
				let endDate = params.endDate
				params.endDate = moment(endDate).format('YYYY-MM-DD')
			} else {
				params.endDate = null
			}
			SupplierTkList(params)
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
