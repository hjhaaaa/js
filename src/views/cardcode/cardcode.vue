<template>
	<div class="cradcode">
		<a-card title="激活码管理">
			<div class="mycrad">
				<table class="mycradtable" border="1">
					<tr>
						<td class="mycard-title">当前账号：</td>
						<td class="mycard-title">{{ currentUserName }}</td>
						<td class="mycard-title">剩余激活码：</td>
						<td class="mycard-title">{{ myCardCodeCount }}</td>
					</tr>
					<tr>
						<td>购买方式：</td>
						<td colspan="3">
							扫码添加
							<a @click="showKFQr">客服微信</a>购买,按下列价格购买二维码
						</td>
					</tr>
					<tr>
						<td>价格:</td>
						<td colspan="3">
							<a-button type="primary">1~20个(24元/个)</a-button>
							<a-button type="primary">21~100个(22元/个)</a-button>
							<a-button type="primary">101~1999个(20元/个)</a-button>
							<a-button type="primary">2000个以上(19元/个)</a-button>
						</td>
					</tr>
				</table>
			</div>
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="激活码">
					<a-input v-model="form.CardCode" placeholder="请输入激活码" />
				</a-form-item>
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>
				<a-form-item label="工位Id">
					<a-input v-model="form.WorkstationId" placeholder="请输入工位Id" />
				</a-form-item>
				<a-form-item label="状态">
					<a-select
						style="width: 200px"
						v-model="form.Status"
						default-value="-1"
					>
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="0">未使用</a-select-option>
						<a-select-option value="1">已使用</a-select-option>
						<a-select-option value="2" v-if="isSupplier"
							>可转让</a-select-option
						>
						<a-select-option value="3" v-if="isSupplier"
							>已转让</a-select-option
						>
					</a-select>
				</a-form-item>

				<a-form-item label="">
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
				<a-form-item label="" v-if="isAdmin">
					<a-button icon="plus-circle" type="primary" @click="add"
						>添加</a-button
					>
				</a-form-item>
			</a-form>

			<div v-if="isSupplier" style="margin-bottom: 16px">
				<!-- :loading="transferLoading" ss -->
				<a-button type="primary" :disabled="!hasSelected" @click="openTransfer"
					>转移激活码</a-button
				>
				<span style="margin-left: 8px">
					<template v-if="hasSelected">{{
						`已选择数量【${transferInfo.transferCount}】`
					}}</template>
				</span>
			</div>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:row-selection="isSupplier ? rowSelection : undefined"
				:scroll="{ x: 1000 }"
			>
				<div slot="UseStatus" slot-scope="row">
					<p v-if="row.UseStatus == 2">充值中</p>
					<p v-else-if="row.UseStatus == 1">已使用</p>
					<p v-else>未使用</p>
				</div>
				<div slot="UseObject" slot-scope="row">
					<div v-if="row.UseStatus == 1">
						<p>用户：{{ row.UserName }}</p>
						<p>工位：{{ row.UseWorkstationId }}</p>
					</div>
				</div>
				<div slot="UseType" slot-scope="row">
					<!-- <p v-if="row.UseType==2">充值中</p> -->
					<p v-if="row.UseType == 1">充值工位</p>
				</div>
				<div slot="CardCode" slot-scope="row">
					<!-- <p v-if="row.UseType==2">充值中</p> -->
					<div>
						{{ row.CardCode }}
						<!-- <a
							type="text"
							v-clipboard:copy="111111"
							v-clipboard:success="copySuccess"
							v-clipboard:error="copyError"
							>复制</a -->
						>
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
		</a-card>

		<a-modal
			class="qrcode"
			v-model="qrVisible"
			title="客服微信二维码"
			:footer="null"
			@cencel="closeKfQr"
			width="400px"
		>
			<div style="text-align: center">
				<img style="width: 240px; height: 240px" src />
			</div>
		</a-modal>

		<a-modal
			v-model="transferVisible"
			title="转让激活码"
			:confirm-loading="transferConfirmLoading"
			@cancel="transferHandleCancel"
			@ok="transferHandleOk"
		>
			<a-form :form="transferForm" :model="transferInfo" ref="transferForm">
				<a-form-item v-bind="formItemLayout" label="转让目标">
					<a-select
						v-model="transferInfo.tkInfo"
						placeholder="请选择转让目标"
						allowClear
						showSearch
						:filter-option="filterUser"
						labelInValue
					>
						<a-select-option v-for="d in userList" :key="d.Id">{{
							d.UserName
						}}</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item v-bind="formItemLayout" label="本次转让数量">
					<a-input
						v-model="transferInfo.transferCount"
						autocomplete="off"
						read-only
					/>
				</a-form-item>
			</a-form>
		</a-modal>

		<a-modal
			class="add"
			width="900px"
			v-model="addVisible"
			title="创建卡密"
			:confirm-loading="addConfirmLoading"
			@cancel="addHandleCancel"
			@ok="addHandleOk"
			><div style="display: inline-block;width: 100%;">
				<div style="width: 50%; float: left">
					<a-form
						ref="addForm"
						:form="addForm"
						:label-col="labelCol"
						:wrapper-col="wrapperCol"
					>
						<a-form-item label="订单号">
							<a-input
								placeholder="订单号"
								autocomplete="off"
								v-decorator="[
									'OrderNo',
									{
										rules: [
											{ required: true, message: 'Please input your note!' },
										],
									},
								]"
							/>
						</a-form-item>
						<a-form-item label="订单金额">
							<a-input
								placeholder="订单金额"
								autocomplete="off"
								v-decorator="[
									'OrderAmont',
									{
										rules: [
											{ required: true, message: 'Please input your note!' },
										],
									},
								]"
							/>
						</a-form-item>
					</a-form>
				</div>
				<div style="width: 50%; float: left">dsd</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment'
// import VueClipboard from 'vue-clipboard2'
import tipMessage from '@/utils/messageUtil.js'
import {
	CardCodeList,
	GetRechargeCode,
	BatchTransferCardCode,
} from '@/api/cardCodeApi.js'
import { UserList } from '@/api/userApi.js'
export default {
	name: 'cardcode',
	components: {},
	data() {
		let checkPending
		let checkCardCode = (rule, value, callback) => {
			clearTimeout(checkPending)
			if (!value) {
				return callback(new Error('请输入卡密数量'))
			}
			checkPending = setTimeout(() => {
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字'))
				} else {
					if (value <= 0) {
						callback(new Error('卡密数量不能小于等于0'))
					} else {
						callback()
					}
				}
			}, 1000)
		}
		return {
			labelCol: { span: 9 },
			wrapperCol: { span: 15 },
			transferForm: this.$form.createForm(this),
			addForm: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				UserName: '',
				WorkstationId: '',
				CardCode: '',
				Status: '-1',
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
					title: '激活码',
					Key: 'CardCode',
					width: '300px',
					//dataIndex: 'CardCode',
					scopedSlots: { customRender: 'CardCode' },
				},
				{
					title: '购买时间',
					Key: 'CTime',
					width: '180px',
					dataIndex: 'CTime',
				},
				{
					title: '使用时间',
					Key: 'UseTime',
					width: '180px	',
					dataIndex: 'UseTime',
				},
				{
					title: '使用状态',
					key: 'UseStatus',
					width: '150px',
					scopedSlots: { customRender: 'UseStatus' },
				},
				{
					title: '使用项目',
					key: 'UseType',
					width: '150px',
					scopedSlots: { customRender: 'UseType' },
				},
				{
					title: '使用对象',
					width: '250px',
					scopedSlots: { customRender: 'UseObject' },
				},
			],
			data: [],
			total: 0,
			isSupplier: false, //是否供应商
			isAdmin: true,
			tableLoading: false,
			transferList: [], //选中的行数据
			transferLoading: false,
			transferVisible: false,
			transferConfirmLoading: false,
			userList: [],
			transferInfo: {
				tkInfo: undefined,
				transferCount: 0,
			},
			qrVisible: false,
			myCardCodeCount: 0,
			currentUserName: '',
			selectedRowKeys: [],
			addVisible: false,
			addLoading: false,
			addConfirmLoading: false,
			addFormModel: {
				OrderNo: '',
			},
			addRules: {
				OrderNo: [
					{
						required: true,
						message: '请输入订单号',
						trigger: 'blur',
					},
				],
				region: [
					{
						required: true,
						message: 'Please select Activity zone',
						trigger: 'change',
					},
				],
				date1: [
					{ required: true, message: 'Please pick a date', trigger: 'change' },
				],
				type: [
					{
						type: 'array',
						required: true,
						message: 'Please select at least one activity type',
						trigger: 'change',
					},
				],
				resource: [
					{
						required: true,
						message: 'Please select activity resource',
						trigger: 'change',
					},
				],
				desc: [
					{
						required: true,
						message: 'Please input activity form',
						trigger: 'blur',
					},
				],
			},
		}
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0
		},
		// hasSelected() {
		// 	return this.hasSelect
		// },
		rowSelection() {
			return {
				selectedRowKeys: this.selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					console.log('selectedRowKeys:', selectedRowKeys)
					this.selectedRowKeys = selectedRowKeys
					this.transferList = selectedRows
					this.transferInfo.transferCount = selectedRowKeys.length
				},
				getCheckboxProps: (record) => ({
					props: {
						disabled: record.TransferString != '可转让', // Column configuration not to be checked
						name: record.CardCode,
					},
				}),
			}
		},
	},
	methods: {
		query() {
			this.tableLoading = true
			let params = Object.assign({}, this.form)
			params.Status *= 1
			CardCodeList(params)
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
		add() {
			this.addVisible = true
		},
		pageChange(p, s) {
			this.form.pageNum = p
			this.query()
		},

		showKFQr() {
			this.qrVisible = true
		},
		closeKfQr() {
			this.qrVisible = false
		},
		getCardCode() {
			let v = this
			GetRechargeCode()
				.then((res) => {
					if (res.IsSuccess) {
						this.myCardCodeCount = res.Data.CardCodeCount
						this.currentUserName = res.Data.UserName
						this.isSupplier = res.Data.isSupplier
					} else {
						tipMessage.error('获取卡密失败')
					}
				})
				.catch(() => {})
		},
		openTransfer() {
			this.transferVisible = true
		},
		transferHandleCancel() {
			this.transferInfo.tkId = undefined
			this.transferList = []
			this.transferInfo.transferCount = 0
			this.selectedRowKeys = []
			this.transferVisible = false
		},
		transferHandleOk() {
			console.log('tkId:', this.transferInfo.tkId)
			if (!this.transferInfo.tkInfo || this.transferInfo.tkInfo.key <= 0) {
				tipMessage.error('请选择转让目标')
				return
			}

			let v = this //保存外层this对象
			this.$confirm({
				title: '提示',
				content: `确定将【${v.transferInfo.transferCount}】个卡密转让给用户【${v.transferInfo.tkInfo.label}】?`,
				okText: '确定',
				onOk() {
					v.transferConfirmLoading = true
					var tkId = parseInt(v.transferInfo.tkInfo.key)
					var ids = v.transferList.map(function (row) {
						return row.Id
					})
					var params = {
						tkId: tkId,
						ids: ids,
					}
					BatchTransferCardCode(params)
						.then((res) => {
							if (res.IsSuccess) {
								v.query()
								v.getCardCode()
								v.transferHandleCancel()
								tipMessage.success('转让成功')
							} else {
								tipMessage.error('转让失败:' + res.Msg)
							}
						})
						.catch(() => {})
				},
				onCancel() {},
			})

			this.transferConfirmLoading = false
		},
		getUserList() {
			var params = {
				pageNum: 1,
				pageSize: 1000,
				IsHasSelf: true,
			}
			UserList(params)
				.then((res) => {
					if (res.Data.length > 0) {
						// var tkList=[];
						// res.Data.forEach(function(row){

						// 	tkList.push(new {Id:row.Id,Text})
						// })

						this.userList = res.Data
					} else {
						fetching = true
					}
				})
				.catch(() => {})
		},
		filterUser(input, option) {
			return (
				option.componentOptions.children[0].text
					.toLowerCase()
					.indexOf(input.toLowerCase()) >= 0
			)
		},
		addHandleOk() {},
		addHandleCancel() {
			this.addVisible = false
		},
		doCopy(row) {
			console.log(row)
			this.$copyText(row.CardCode).then(
				function (e) {
					alert('Copied')
					console.log(e)
				},
				function (e) {
					alert('Can not copy')
					console.log(e)
				}
			)
		},
		copySuccess() {
			alert('copySuccess')
		},
		copyError() {
			alert('copyError')
		},
	},
	created() {
		if (this.isSupplier) {
			this.columns.push({
				title: '转让状态',
				width: '150px',
				dataIndex: 'TransferString',
			})
		}

		this.query()
		this.getCardCode()
		this.getUserList()
	},
}
</script>

<style lang="scss" scoped>
.cradcode {
	.ant-card-grid {
		padding: 15px;
	}
	.price-box button {
		margin-right: 10px;
	}
	.ant-table-body {
		overflow-x: auto !important;
	}
	.mycrad {
		margin-bottom: 15px;
		text-align: center;
	}
	.mycradtable {
		width: 100%;
		border: 1px solid #e8e8e8;
	}
	.mycradtable td {
		width: 25%;
		padding: 10px;
	}
	.mycradtable td button {
		margin-right: 5px;
		margin-bottom: 5px;
	}
	.mycradtable td button:last-child {
		margin-bottom: 0px;
	}
	.add {
	}
	.leftbox {
		width: 50%;
	}
}
</style>
