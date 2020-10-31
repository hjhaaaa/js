<template>
	<div class="userwithdrawal">
		<a-card :bordered="false" title="提现记录">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="淘客账号">
					<a-input v-model="form.userName" placeholder="淘客账号" />
				</a-form-item>
				<a-form-item label="开始日期">
					<a-date-picker
						v-model="form.startDate"
						valueFormat="YYYY-MM-DD"
						placeholder="开始日期"
					/>
				</a-form-item>
				<a-form-item label="结束日期">
					<a-date-picker format="YYYY-MM-DD" placeholder="结束日期" />
				</a-form-item>
				<a-form-item label="状态">
					<a-select style="width: 120px" v-model="form.status">
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="0">待审核</a-select-option>
						<a-select-option value="1">已审核</a-select-option>
						<a-select-option value="2">已驳回</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="">
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
				<a-form-item label="">
					<a-button icon="file-excel" type="primary" @click="exportExcel"
						>导出结果</a-button
					>
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
				<div class="table operation" slot="actionSlot" slot-scope="row">
					<a-button
						type="primary"
						v-if="row.WithdrawalStatus == 0"
						size="small"
						@click="reviewPass(row)"
						>通过</a-button
					>
					<a-button
						type="primary"
						v-if="row.WithdrawalStatus == 0"
						size="small"
						@click="reviewReject(row)"
						>驳回</a-button
					>
				</div>
				<div slot="alipaySlot" slot-scope="row">
					<div>姓名:{{ row.AlipayName }}</div>
					<div>账号:{{ row.Alipay }}</div>
				</div>
				<div slot="withdrawalStatusSlot" slot-scope="row">
					<div v-if="row.WithdrawalStatus == 1">审核通过</div>
					<div v-else-if="row.WithdrawalStatus == 2">
						驳回：{{ row.ReviewRemark }}
					</div>
					<div v-else>待审核</div>
					<div v-if="row.WithdrawalStatus != 0">{{ row.ReviewTime }}</div>
				</div>
				<div slot="balanceSlot" slot-scope="row">
					<p>{{ row.OperateType == 1 ? '+' : '-' }}{{ row.Balance }}</p>
				</div>
			</a-table>
			<div style="margin: 10px">
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

		<PromptDialogCom
			:visible.sync="promptVisible"
			title="驳回原因"
			errorMessage="驳回原因不能为空"
			placeholder="请输入驳回原因"
			@ok="promptOk"
			@cancel="promptCancel"
		></PromptDialogCom>
	</div>
</template>

<script>
import moment from 'moment'
import {
	UserWithdrawalList,
	UserWithdrawalExportExcel,
	UserWithdrawalReviewPass,
	UserWithdrawalReviewReject,
} from '@/api/admin/userwithdrawalApi.js'
import PromptDialogCom from '@/components/MyDialog/promptDialog.vue'
export default {
	name: 'userwithdrawal',
	components: { PromptDialogCom },
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
				userName: '',
				status: '-1',
				startDate: undefined,
				endDate: undefined,
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
					title: 'TkId',
					width: '100px',
					dataIndex: 'UserId',
				},
				{
					title: '淘客账户',
					width: '180px',
					dataIndex: 'UserName',
				},
				{
					title: '提现金额',
					width: '100px',
					dataIndex: 'Balance',
				},
				// {
				// 	title: '支付宝账户',
				// 	width: '150px',
				// 	dataIndex: 'Alipay',
				// },
				{
					title: '支付宝信息',
					width: '200px',
					// dataIndex: 'AlipayName',
					scopedSlots: { customRender: 'alipaySlot' },
				},
				{
					title: '提现状态',
					width: '250px',
					scopedSlots: { customRender: 'withdrawalStatusSlot' },
				},
				{
					title: '申请时间',
					width: '180px',
					dataIndex: 'CTime',
				},
				// {
				// 	title: '审核时间',
				// 	width: '180px',
				// 	dataIndex: 'ReviewTime',
				// },
				{
					title: '操作',
					width: '200px',
					scopedSlots: { customRender: 'actionSlot' },
				},
			],
			data: [],
			total: 0,
			tableLoading: false,
			promptVisible: false, //驳回对话框显示状态
			reviewId: undefined, //当前审核id
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
			let params = this.getQueryParams()

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
		getQueryParams() {
			let params = Object.assign({}, this.form)
			params.status *= 1
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
			return params
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
		exportExcel() {
			let params = this.getQueryParams()
			UserWithdrawalExportExcel(params)
				.then((res) => {
					// console.log('res', res)

					let fileName = res.headers['content-disposition']
					//     // 获取文件名
					if (fileName && fileName.length >= 2) {
						fileName = fileName.split('=')[1]
					}
					fileName = decodeURIComponent(fileName)

					let blob = new Blob([res.data])
					let downloadElement = document.createElement('a')
					let href = window.URL.createObjectURL(blob) //创建下载的链接
					downloadElement.href = href
					downloadElement.download = fileName //下载后文件名
					document.body.appendChild(downloadElement)
					downloadElement.click() //点击下载
					document.body.removeChild(downloadElement) //下载完成移除元素
					window.URL.revokeObjectURL(href) //释放掉blob对象
				})
				.catch(() => {})
		},
		reviewPass(row) {
			this.tableLoading = true
			UserWithdrawalReviewPass(row.Id)
				.then((res) => {
					this.query()
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		reviewReject(row) {
			this.promptVisible = true
			this.reviewId = row.Id
			this.tableLoading = true
		},
		promptOk(value) {
			console.log('value:', value)
			UserWithdrawalReviewReject(this.reviewId, value)
				.then((res) => {
					this.query()
					// this.tableLoading = false
					// this.promptVisible = false
					// this.reviewId = undefined
					this.promptCancel();
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		promptCancel() {
			this.tableLoading = false
			this.promptVisible = false
			this.reviewId = undefined
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

	.my .ant-btn {
		margin-right: 10px;
		// margin-bottom: 10px;
	}
}
</style>
<style lang="scss">
.userwithdrawal {
	.table.operation button {
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.table.operation button:last-child {
		margin-bottom: 0px;
	}
}
</style>
