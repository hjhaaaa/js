<template>
	<div>
		<a-card title="激活码订单列表">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="订单号">
					<a-input v-model="form.OrderNo" placeholder="请输入订单号" />
				</a-form-item>
				<a-form-item label="淘客">
					<a-input v-model="form.TkUserName" placeholder="请输入淘客" />
				</a-form-item>
				<a-form-item label="开始日期">
					<a-date-picker
						v-model="form.startDate"
						valueFormat="YYYY-MM-DD"
						placeholder="开始日期"
					/>
				</a-form-item>
				<a-form-item label="结束日期">
					<a-date-picker
						v-model="form.endDate"
						format="YYYY-MM-DD"
						placeholder="结束日期"
					/>
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
				<div slot="SourceType" slot-scope="row">
					<p v-if="row.SourceType == 2">赠送</p>
					<p v-else-if="row.SourceType == 1">用户购买</p>
					<p v-else>公司自用</p>
				</div>

				<div slot="ImgUrl" slot-scope="row">
					<div>
						<a type="link" @click="openImagePreview(row)">查看</a>
					</div>
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
				:visible="previewVisible"
				:footer="null"
				@cancel="previewHandleCancel"
			>
				<img alt="example" style="width: 100%" :src="previewImage" />
			</a-modal>
		</a-card>
	</div>
</template>

<script>
import { CardCodeOrderList } from '@/api/admin/cardCodeOrderApi.js'

export default {
	name: 'cardCodeOrderList',
	data() {
		return {
			form: {
				OrderNo: '',
				TkUserName: '',
				startDate: undefined,
				endDate: undefined,
				pageSize: 10,
				pageNum: 1,
			},
			columns: [
				{
					title: '序号',
					Key: 'Id',
					width: '50px',
					dataIndex: 'Id',
				},
				{
					title: '订单号',
					Key: 'OrderNo',
					width: '100px',
					dataIndex: 'OrderNo',
				},
				{
					title: '价格',
					Key: 'Price',
					width: '50px',
					dataIndex: 'Price',
				},
				{
					title: '数量',
					Key: 'CodeCount',
					width: '50px',
					dataIndex: 'CodeCount',
				},
				{
					title: '金额',
					Key: 'OrderAmout',
					width: '100px',
					dataIndex: 'OrderAmout',
				},
				{
					title: '淘客',
					Key: 'TkUserName',
					width: '100px',
					dataIndex: 'TkUserName',
				},
				{
					title: '来源',
					key: 'SourceType',
					width: '100px',
					scopedSlots: { customRender: 'SourceType' },
				},
				{
					title: '操作员',
					Key: 'Operator',
					width: '100px',
					dataIndex: 'Operator',
				},
				{
					title: '创建时间',
					Key: 'Ctime',
					width: '100px',
					dataIndex: 'Ctime',
				},
				{
					title: '图片',
					Key: 'ImgUrl',
					width: '100px',
					scopedSlots: { customRender: 'ImgUrl' },
				},
			],
			data: [],
			total: 0,
			tableLoading: false,
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
			previewVisible: false,
			previewImage: '',
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			let params = Object.assign({}, this.form)
			CardCodeOrderList(params)
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
		openImagePreview(row) {
			this.previewImage = row.ImgUrl
			this.previewVisible = true
		},
		previewHandleCancel() {
			this.previewVisible = false
		},
	},
	created() {
		this.query()
	},
}
</script>
