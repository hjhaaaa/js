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
					<a-input v-model="form.CardCode" placeholder="查询的激活码" />
				</a-form-item>
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="使用的用户名" />
				</a-form-item>
				<a-form-item label="工位Id">
					<a-input v-model="form.WorkstationId" placeholder="使用的工位Id" />
				</a-form-item>
				<a-form-item label="状态">
					<a-select
						style="width: 100px"
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
			</a-form>

			<div id="transferCode" v-if="isSupplier" style="margin-bottom: 16px">
				<!-- :loading="transferLoading" ss -->
				<a-button type="primary" @click="openTransfer">转移激活码</a-button>
				<!-- <span style="margin-left: 8px">
					<template v-if="hasSelected">{{
						`已选择数量【${transferInfo.transferCount}】`
					}}</template>
				</span>
					:row-selection="isSupplier ? rowSelection : undefined"
				 -->
			</div>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
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
						<!-- <input class="tableCode" type="text" :value="row.CardCode" /> -->
						<a v-if="row.TransferString!='可转让'" type="link" @click="doCopy(row)">复制</a>
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
			<!-- <a-form :form="transferForm" :model="transferInfo" ref="transferForm">
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
				<a-form-item v-bind="formItemLayout" label="可转数量：">
					<a-input :value="myCardCodeCount" autocomplete="off" read-only />
					
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="本次转让数量">
					<a-input v-model="transferInfo.transferCount" autocomplete="off" />
				
				</a-form-item>
			</a-form>
		</a-modal> -->

			<a-form :form="transferForm" :model="transferInfo" ref="transferForm">
				<a-form-item v-bind="formItemLayout" label="可转数量：">
					<a-input :value="myCanTransferCount" autocomplete="off" read-only />
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="转让目标">
					<a-select
						placeholder="请选择转让目标"
						allowClear
						showSearch
						:filter-option="filterUser"
						labelInValue
						v-decorator="[
							'tkInfo',
							{
								rules: [{ required: true, message: '请选择转让目标' }],
							},
						]"
					>
						<a-select-option v-for="d in userList" :key="d.Id">{{
							d.UserName
						}}</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item v-bind="formItemLayout" label="转让数量">
					<!-- <a-input v-model="transferInfo.transferCount" autocomplete="off" /> -->
					<a-input
						placeholder="转让数量"
						autocomplete="off"
						v-decorator="[
							'transferCount',
							{
								rules: [
									{ required: true, message: '请输入转让数量' },
									{ pattern: /^[0-9]*$/g, message: '转让数量必须为数字' },
								],
							},
						]"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
function getBase64(img, callback) {
	const reader = new FileReader()
	reader.addEventListener('load', () => callback(reader.result))
	reader.readAsDataURL(img)
}
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import {
	CardCodeList,
	GetRechargeCode,
	BatchTransferCardCode,
} from '@/api/tk/cardCodeApi.js'
import { UserList, GetLoginUserInfo } from '@/api/tk/userApi.js'
export default {
	name: 'cardcode',
	components: {},
	data() {
		let checkPending
		let checkCardCode = (rule, value, callback) => {
			clearTimeout(checkPending)
			if (!value) {
				return callback(new Error('请输入激活码数量'))
			}
			checkPending = setTimeout(() => {
				if (!Number.isInteger(value)) {
					callback(new Error('请输入数字'))
				} else {
					if (value <= 0) {
						callback(new Error('激活码数量不能小于等于0'))
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
					width: '300px',
					scopedSlots: { customRender: 'CardCode' },
				},
				{
					title: '购买时间',
					width: '180px',
					dataIndex: 'CTime',
				},
				{
					title: '使用状态',
					width: '100px',
					scopedSlots: { customRender: 'UseStatus' },
				},
				{
					title: '使用时间',
					width: '180px',
					dataIndex: 'UseTime',
				},

				{
					title: '使用项目',
					width: '150px',
					scopedSlots: { customRender: 'UseType' },
				},
				{
					title: '使用对象',
					width: '200px',
					scopedSlots: { customRender: 'UseObject' },
				},
			],
			data: [],
			total: 0,
			isSupplier: false, //是否供应商
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
			myCanTransferCount: 0,
			currentUserName: '',
			selectedRowKeys: [],
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
		getLoginUserInfo() {
			let v = this
			GetLoginUserInfo()
				.then((res) => {
					if (res.Data.IsSupplier) {
						this.isSupplier = true
						this.columns.push({
							title: '转让状态',
							width: '150px',
							dataIndex: 'TransferString',
						})
					}
					this.query()
				})
				.catch(() => {})
		},
		getCardCode() {
			let v = this
			GetRechargeCode()
				.then((res) => {
					this.myCardCodeCount = res.Data.CardCodeCount
					this.myCanTransferCount = res.Data.CanTransferCount
					this.currentUserName = res.Data.UserName
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
			// if (!this.transferInfo.tkInfo || this.transferInfo.tkInfo.key <= 0) {
			// 	tipMessage.error('请选择转让目标')
			// 	return
			// }
			this.transferForm.validateFieldsAndScroll((err, values) => {
				console.log(values)
				let tkInfo = values.tkInfo
				if (!err) {
					let v = this //保存外层this对象
					this.$confirm({
						title: '提示',
						content: `确定将【${values.transferCount}】个激活码转让给用户【${tkInfo.label}】?`,
						okText: '确定',
						onOk() {
							v.transferConfirmLoading = true
							var tkId = parseInt(tkInfo.key)
							// var ids = v.transferList.map(function (row) {
							// 	return row.Id
							// })
							var params = {
								tkId: tkId,
								TransferCount: values.transferCount * 1,
							}
							BatchTransferCardCode(params)
								.then((res) => {
									v.query()
									v.getCardCode()
									v.transferHandleCancel()
									tipMessage.success('转让成功')
									v.transferConfirmLoading = false
								})
								.catch(() => {
									v.transferConfirmLoading = false
								})
						},
						onCancel() {
							v.transferConfirmLoading = false
						},
					})
				}
			})
		},
		getUserList() {
			var params = {
				pageNum: 1,
				pageSize: 10000,
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

		doCopy(row) {
			console.log('复制对象', row) //row.CardCode
			this.$copyText(row.CardCode).then(
				function (e) {
					tipMessage.success('复制激活码成功')
				},
				function (e) {
					tipMessage.error('复制激活码失败,可能是浏览器不支持')
				}
			)
		},
	},
	created() {
		this.getLoginUserInfo()
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

	.leftbox {
		width: 50%;
	}
}
</style>
