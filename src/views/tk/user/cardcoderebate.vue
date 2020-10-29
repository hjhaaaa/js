<template>
	<div class="cardcoderebate">
		<a-card title="我的佣金" :bordered="false" style="margin-bottom: 10px">
			<div class="my">
				<p>当前佣金：{{ balance }}</p>
				<a-button
					type="primary"
					:disabled="this.balance <= 0"
					@click="openWithdrawalHandle"
					:loading="addWithdrawalButtonLoading"
					>申请提现</a-button
				>
				<a-button type="primary" @click="openWithdrawal">提现记录</a-button>
			</div>
		</a-card>
		<a-card title="激活码分佣" :bordered="false">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="推广账号">
					<a-input v-model="form.tkUserName" placeholder="请输入推广账号" />
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
						format="YYYY-MM-DD"
						placeholder="结束日期"
						@change="onChange"
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
				:scroll="{ x: 400 }"
			>
				<div class="table operation" slot="action" slot-scope="row">
					<a type="link" @click="edit(row)">编辑</a>
					<a type="link" :disabled="isCanDel(row)" @click="remove(row)">删除</a>
				</div>

				<div slot="titleSlot" slot-scope="row">
					<p>状态:{{ row.LogType == 1 ? '启用' : '禁用' }}</p>
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
		<a-modal
			title="申请提现"
			:visible="addWithdrawalVisible"
			:confirmLoading="addWithdrawalLoading"
			@ok="addWithdrawalHandleOk"
			@cancel="addWithdrawalHandleCancel"
		>
			<a-form
				:form="addWithdrawalForm"
				:rules="addWithdrawalRules"
				ref="addWithdrawalForm"
			>
				<a-form-item v-bind="formItemLayout" label="支付宝">
					<a-input
						placeholder="请输入支付宝"
						v-decorator="addWithdrawalRules.alipay"
					/>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="支付宝姓名" prop="userName">
					<a-input
						placeholder="请输入支付宝姓名"
						v-decorator="addWithdrawalRules.alipayName"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<UserWithdrawalCom
			:visible.sync="withdrawalStatus"
			@callback="withdrawalCallback"
		></UserWithdrawalCom>
	</div>
</template>

<script>
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import { GetLoginUserInfo } from '@/api/tk/userApi.js'
import { CardCodeRebateList } from '@/api/tk/userBalanceLogApi.js'
import { CreateUserWithdrawal } from '@/api/tk/userwithdrawalApi.js'
import { constants } from 'zlib'
import { callbackify, log } from 'util'
import { deeppink } from 'color-name'
import UserWithdrawalCom from '@/views/tk/user/userwithdrawal.vue'
// import { MyDialog } from '@/'
export default {
	name: 'cardcoderebate',
	components: { UserWithdrawalCom },
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
				tkUserName: '',
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
					title: '推广账号',
					width: '200px',
					dataIndex: 'TKUserName',
				},
				{
					title: '购买数量',
					width: '120px',
					dataIndex: 'CodeCount',
				},

				{
					title: '分佣金额',
					width: '120px',
					dataIndex: 'Balance',
				},
				{
					title: '时间',
					Key: 'CTime',
					width: '180px',
					dataIndex: 'CTime',
				},
			],
			visible: false, //添加用户
			data: [],
			total: 0,
			tableLoading: false,
			addWithdrawalForm: this.$form.createForm(this),
			addWithdrawalVisible: false,
			addWithdrawalDisabled: false,
			addWithdrawalLoading: false,
			addWithdrawalButtonLoading: false,
			addWithdrawalInfo: {
				Id: 0,
				IsNeedTLinkValue: 1,
				GroupInfo: '',
				Name: '',
			},
			addWithdrawalRules: {
				alipay: [
					'alipay',
					{
						rules: [
							{
								required: true,
								message: '支付宝账号不能为空!',
							},
						],
					},
				],
				alipayName: [
					'alipayName',
					{
						rules: [
							{
								required: true,
								message: '支付宝名称不能为空!',
							},
						],
					},
				],
			},
			classifyGroupStatus: false,
			editConfirmLoading: false,
			balance: 0,
			// 提现弹窗状态
			withdrawalStatus: false,
		}
	},
	methods: {
		moment,
		onChange(value, dateString) {
			console.log('value: ', value)
			console.log('dateString: ', dateString)
			this.form.endDate = dateString
		},
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
			CardCodeRebateList(params)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		getLoginUserInfo() {
			let v = this
			GetLoginUserInfo()
				.then((res) => {
					if (res.Data.IsSupplier) {
						this.balance = res.Data.Balance
						this.loginUserInfo = res.Data
					}
				})
				.catch(() => {})
		},
		handleSearch() {
			this.form.pageNum = 1
			this.query()
		},
		pageChange(p, s) {
			this.form.pageNum = p
			this.query()
		},
		openWithdrawalHandle() {
			this.addWithdrawalButtonLoading = true
			if (this.loginUserInfo.alipay && this.loginUserInfo.alipayName) {
			} else {
				this.addWithdrawalVisible = true
			}
		},
		addWithdrawalHandleCancel() {
			this.addWithdrawalVisible = false
			this.addWithdrawalButtonLoading = false
		},
		addWithdrawalHandleOk() {
			console.log('addWithdrawalHandleOk')

			this.addWithdrawalForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					this.addWithdrawalLoading = true
					console.log('addWithdrawalForm values: ', values)
					CreateUserWithdrawal(values)
						.then((res) => {
							this.getLoginUserInfo()
							tipMessage.success('申请成功')
						})
						.catch(() => {})
					this.addWithdrawalHandleCancel()
				}
			})
		},
		openWithdrawal() {
			this.withdrawalStatus = true
		},
		withdrawalCallback(res) {
			if(res.success){
				this.withdrawalStatus = false;
			}
		},
	},
	created() {
		this.getLoginUserInfo()
		this.query()
	},
}
</script>

<style lang="scss" scoped>
.cardcoderebate {
	.ant-table-body {
		overflow-x: auto !important;
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
