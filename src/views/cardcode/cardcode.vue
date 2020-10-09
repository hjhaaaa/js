<template>
	<div>
		<a-card title="激活码管理">
			<a-card title style="width:80%;margin-bottom: 20px">
				<a-card-grid style="width:15%;text-align:center">当前账号：</a-card-grid>
				<a-card-grid style="width:15%;text-align:center">{{currentUserName}}</a-card-grid>
				<a-card-grid style="width:15%;text-align:center">剩余激活码：</a-card-grid>
				<a-card-grid style="width:15%;text-align:center">{{myCardCodeCount}}</a-card-grid>
				<a-card-grid style="width:15%;text-align:center">购买方式：</a-card-grid>
				<a-card-grid style="width:25%;text-align:center">
					扫码添加
					<a @click="showKFQr">客服微信</a>购买,按下列价格购买二维码
				</a-card-grid>

				<a-card-grid style="width:15%;text-align:center">价格：</a-card-grid>
				<a-card-grid style="width:85%;text-align:left;padding:9.5px;" class="price-box">
					<a-button type="primary">5~30个（30元一个）</a-button>
					<a-button type="primary">31~100个（28元一个）</a-button>
					<a-button type="primary">101~1000个（25元一个）</a-button>
					<a-button type="primary">1000个以上（23元一个）</a-button>
				</a-card-grid>
			</a-card>

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
					<a-select style="width:100px" v-model="form.Status" default-value="-1">
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="0">未使用</a-select-option>
						<a-select-option value="1">已使用</a-select-option>
						<a-select-option value="2" v-if="isSupplier">可转让</a-select-option>
						<a-select-option value="3" v-if="isSupplier">已转让</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
			</a-form>
			<div v-if="isSupplier" style="margin-bottom: 16px">
				<!-- :loading="transferLoading" ss -->
				<a-button type="primary" :disabled="!hasSelected" @click="openTransfer">转移激活码</a-button>
				<span style="margin-left: 8px">
					<template v-if="hasSelected">{{ `已选择数量【${transferInfo.transferCount}】` }}</template>
				</span>
			</div>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:row-selection="isSupplier ? rowSelection : undefined"
			>
				<div slot="UseStatus" slot-scope="row">
					<p v-if="row.UseStatus==2">充值中</p>
					<p v-else-if="row.UseStatus==1">已使用</p>
					<p v-else>未使用</p>
				</div>
				<div slot="UseObject" slot-scope="row">
					<div v-if="row.UseStatus==1">
						<p>用户：{{row.UserName}}</p>
						<p>工位：{{row.UseWorkstationId}}</p>
					</div>
				</div>
				<div slot="UseType" slot-scope="row">
					<!-- <p v-if="row.UseType==2">充值中</p> -->
					<p v-if="row.UseType==1">充值工位</p>
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

		<a-modal
			class="qrcode"
			v-model="qrVisible"
			title="客服微信二维码"
			:footer="null"
			@cencel="closeKfQr"
			width="400px"
		>
			<div>
				<img src />
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
						<a-select-option v-for="d in userList" :key="d.Id">{{ d.UserName }}</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item v-bind="formItemLayout" label="本次转让数量">
					<a-input v-model="transferInfo.transferCount" autocomplete="off" read-only />
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import {
	CardCodeList,
	GetRechargeCode,
	BatchTransferCardCode
} from '@/api/cardCodeApi.js'
import { UserList } from '@/api/userApi.js'
export default {
	name: 'cardcode',
	components: {},
	data() {
		return {
			transferForm: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 }
				},
				wrapperCol: {
					sm: { span: 12 }
				}
			},
			form: {
				UserName: '',
				WorkstationId: '',
				CardCode: '',
				Status: '-1',
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
					width: '250px',
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
					width: '200px	',
					dataIndex: 'UseTime'
				},
				{
					title: '使用状态',
					key: 'UseStatus',
					width: '120px',
					scopedSlots: { customRender: 'UseStatus' }
				},
				{
					title: '使用项目',
					key: 'UseType',
					width: '120px',
					scopedSlots: { customRender: 'UseType' }
				},
				{
					title: '使用对象',
					width: '250px',
					scopedSlots: { customRender: 'UseObject' }
				}
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
				transferCount: 0
			},
			qrVisible: false,
			myCardCodeCount: 0,
				currentUserName: "",
			selectedRowKeys: []
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
				getCheckboxProps: record => ({
					props: {
						disabled: record.TransferString != '可转让', // Column configuration not to be checked
						name: record.CardCode
					}
				})
			}
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			let params = Object.assign({}, this.form)
			params.Status *= 1
			CardCodeList(params)
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
				.then(res => {
					if (res.IsSuccess) {
						this.myCardCodeCount = res.Data.CardCodeCount
						this.currentUserName=res.Data.UserName
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
					var ids = v.transferList.map(function(row) {
						return row.Id
					})
					var params = {
						tkId: tkId,
						ids: ids
					}
					BatchTransferCardCode(params)
						.then(res => {
							if (res.IsSuccess) {
								v.query()
								v.transferHandleCancel()
								tipMessage.success('转让成功')
							} else {
								tipMessage.error('转让失败:' + res.Msg)
							}
						})
						.catch(() => {})
				},
				onCancel() {}
			})

			this.transferConfirmLoading = false
		},
		getUserList() {
			var params = {
				pageNum: 1,
				pageSize: 1000,
				IsHasSelf: true
			}
			UserList(params)
				.then(res => {
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
		}
	},
	created() {
		if (this.isSupplier) {
			this.columns.push({
				title: '转让状态',
				width: '120px',
				dataIndex: 'TransferString'
			})
		}

		this.query()
		this.getCardCode()
		this.getUserList()
	}
}
</script>

<style lang="scss" scoped>
.ant-card-grid {
	padding: 15px;
}
.price-box button {
	margin-right: 10px;
}

.qrcode div:first-child {
	text-align: center;
}
.qrcode div:first-child img {
	width: 300px;
	height: 300px;
}
</style>
