<template>
	<div>
		<a-modal
		:closable="true"
			title="提现记录"
			:visible="visible"
			:footer="null"
			width="80%"
			:bodyStyle="{'height': '70vh'}"
			:class="'user-userwithdrawal'"
			@cancel="handleCancel"
		>
			<a-card :bordered="false">
				<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				
					<a-form-item label="开始日期">
						<a-date-picker
							v-model="form.startDate"
							valueFormat="YYYY-MM-DD"
							placeholder="开始日期"
						/>
					</a-form-item>
					<a-form-item label="结束日期">
						<a-date-picker
							format="YYYY-MM-DD"
							placeholder="结束日期"
							
						/>
					</a-form-item>
					<a-form-item>
						<a-button icon="search" @click="handleSearch">查询</a-button>
					</a-form-item>
				</a-form>

				<a-table
					:bordered="false"
					:columns="columns"
					:dataSource="data"
					rowKey="Id"
					:loading="tableLoading"
					:pagination="false"
					:scroll="{ x: 600 }"
				>
					<div class="table operation" slot="action" slot-scope="row">
						<a type="link" @click="edit(row)">编辑</a>
						<a type="link" :disabled="isCanDel(row)" @click="remove(row)"
							>删除</a
						>
					</div>

					<div slot="withdrawalStatusSlot" slot-scope="row">
						<div v-if="row.WithdrawalStatus == 1">审核通过</div>
						<div v-else-if="row.WithdrawalStatus == 2">
							驳回：{{ row.ReviewRemark }}
						</div>
						<div v-else>待审核</div>
					</div>
					<div slot="balanceSlot" slot-scope="row">
						<p>{{ row.OperateType == 1 ? '+' : '-' }}{{ row.Balance }}</p>
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
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment'
import { UserWithdrawalList } from '@/api/tk/userwithdrawalApi.js'
import { constants } from 'zlib'
import { callbackify, log } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'userwithdrawal',
	components: {},
	data() {
		return {
			aform: this.$form.createForm(this),
			loginUserInfo: undefined,
			formItemLayout: {
				labelCol: {
					sm: { span: 7 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				startDate: undefined,
				endDate: undefined,
				status:-1,
				pageSize: 20,
				pageNum: 1,
			},
			columns: [
				{
					title: '序号',
					width: '100px',
					dataIndex: 'Id',
				},
				{
					title: '提现金额',
					width: '200px',
					dataIndex: 'Balance',
				},
				{
					title: '支付宝账户',
					width: '200px',
					dataIndex: 'Alipay',
				},
				{
					title: '支付宝姓名',
					width: '200px',
					dataIndex: 'AlipayName',
				},
				{
					title: '提现状态',
					width: '250px',
					// dataIndex: 'AlipayName',
					scopedSlots: { customRender: 'withdrawalStatusSlot' },
				},
				{
					title: '申请时间',
					width: '180px',
					dataIndex: 'CTime',
				},
			],
			data: [],
			total: 0,
			tableLoading: false,
		}
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		moment,
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
			UserWithdrawalList(params)
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
		handleCancel() {
			// this.$emit('callback')
			this.$emit('callback', {
				success: true,
				type: 'close',
				source: 'dialog-close',
			})
		},
	},
	created() {
		this.query()
	},
}
</script>

<style lang="scss" scoped>
.userwithdrawal {
	.ant-table-body {
		overflow-x: auto !important;
	}
	.ant-modal-body {
		padding: 0px !important;
	}

	.table.operation a {
		padding-right: 10px;
	}
	.my .ant-btn {
		margin-right: 10px;
		// margin-bottom: 10px;
	}
}
</style>
<style lang="scss">
.user-userwithdrawal {
	.ant-card-body {
		padding: 0px !important;
	}
	.ant-modal{
		top: 50px !important;
	}
}
</style>
