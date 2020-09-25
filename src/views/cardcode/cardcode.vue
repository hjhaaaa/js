<template>
	<div>
		<a-card title="激活码管理" :bordered="false">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="激活码">
					<a-input v-model="form.CardCode" placeholder="请输入激活码" />
				</a-form-item>
				<a-form-item label="状态">
					<a-select v-model="form.Status">
						<a-select-option value="all">全部</a-select-option>
						<a-select-option value="0">未使用</a-select-option>
						<a-select-option value="1">已使用</a-select-option>
						<a-select-option value="2">已转移</a-select-option>
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
			>
				<div slot="Status" slot-scope="row">
					<p v-if="row.StationRechageType==2">充值中</p>
					<p v-else-if="row.StationRechageType==1">已充值</p>
					<p v-else>未充值</p>
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
	</div>
</template>

<script>
import moment from 'moment'
import notification from 'ant-design-vue/es/notification'
import { CardCodeList, GetRechargeCode } from '@/api/cardCodeAPI.js'

export default {
	name: 'cardcode',
	components: {},
	data() {
		return {
			aform: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 }
				},
				wrapperCol: {
					sm: { span: 12 }
				}
			},
			form: {
				CardCode: '',
				Status: 'all',
				pageSize: 20,
				pageNum: 1
			},
			columns: [
				{
					title: '序号',
					width: '100px',
					dataIndex: 'Id'
				},
				{
					title: '激活码',
					Key: 'CardCode',
					width: '130px',
					dataIndex: 'CardCode'
				},
				{
					title: '购买时间',
					Key: 'CTime',
					width: '200px',
					dataIndex: 'CTime'
				},
				{
					title: '使用时间',
					Key: 'UseTime',
					width: '200px',
					dataIndex: 'UseTime'
				},
				{
					title: '备注',
					Key: 'Remarks',
					width: '20%',
					dataIndex: 'Remarks',
					scopedSlots: { customRender: 'editRemarks' }
				},
				{
					title: '微信用户',
					Key: '',
					width: '120px',
					dataIndex: '',
					scopedSlots: { customRender: 'showWXAvatar' }
				},
				{
					title: '微信操作',
					Key: '',
					width: '120px',
					dataIndex: '',
					scopedSlots: { customRender: 'wxOp' }
				},
				{
					title: '微信状态',
					Key: '',
					width: '100px',
					dataIndex: '',
					scopedSlots: { customRender: 'wxStatus' }
				},
				{
					title: '状态',
					key: 'Status',
					width: '100px',
					scopedSlots: { customRender: 'Status' }
				},
				{
					title: '发单状态',
					key: 'SwitchStatus',
					width: '100px',
					scopedSlots: { customRender: 'opSwitchStatus' }
				}
			],
			data: [],
			total: 0,
			tableLoading: false
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			CardCodeList(this.form)
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
