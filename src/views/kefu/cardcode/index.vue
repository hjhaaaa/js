<template>
	<div class="cradcode">
		<a-card title="激活码管理">
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
				<a-form-item label="">
					<a-button icon="plus-circle" type="primary" @click="add"
						>添加激活码</a-button
					>
				</a-form-item>
			</a-form>

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
						<!-- <input class="tableCode" type="text" :value="row.CardCode" /> -->
						<a type="link" @click="doCopy(row)">复制</a>
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
			class="add"
			width="900px"
			v-model="addVisible"
			title="创建激活码"
			:confirm-loading="addConfirmLoading"
		>
			<template slot="footer">
				<a-button @click="addHandleCancel">关闭</a-button>
			</template>
			<div style="display: inline-block; width: 100%">
				<div style="width: 50%; float: left">
					<a-form
						ref="addForm"
						:form="addForm"
						:label-col="labelCol"
						:wrapper-col="wrapperCol"
					>
						<a-form-item label="淘客Id">
							<a-input
								placeholder="淘客Id"
								autocomplete="off"
								v-decorator="[
									'TkId',
									{
										rules: [
											{
												required: true,
												message: '请输入淘客Id',
												trigger: 'blur,change',
											},
											{ pattern: /^[0-9]*$/g, message: '淘客Id必须为数字' },
										],
									},
								]"
							/>
						</a-form-item>
						<a-form-item label="订单号">
							<a-input
								placeholder="订单号"
								autocomplete="off"
								v-decorator="[
									'OrderNo',
									{
										rules: [{ required: true, message: '充值的单号' }],
									},
								]"
							/>
						</a-form-item>
						<a-form-item label="订单金额">
							<a-input
								placeholder="订单金额"
								autocomplete="off"
								v-decorator="[
									'OrderAmout',
									{
										rules: [
											{ required: true, message: '订单的金额' },
											{ pattern: /^[0-9]*$/g, message: '金额必须为数字' },
										],
									},
								]"
							/>
						</a-form-item>

						<a-form-item label="激活码数量">
							<a-input
								placeholder="激活码数量"
								autocomplete="off"
								v-decorator="[
									'CodeCount',
									{
										rules: [
											{ required: true, message: '请输入激活码数量' },
											{ pattern: /^[0-9]*$/g, message: '数量必须为数字' },
										],
									},
								]"
							/>
						</a-form-item>
						<a-form-item label="激活码类型">
							<a-select
								v-decorator="[
									'CardCodeType',
									{
										rules: [{ required: true, message: '请选择激活码类型' }],
									},
								]"
								placeholder="请选择激活码类型"
							>
								<a-select-option value="1"> 月卡 </a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="返佣类型">
							<a-select
								v-decorator="[
									'RebateType',
									{
										rules: [{ required: true, message: '请选择返佣类型' }],
									},
								]"
								placeholder="请选择返佣类型"
							>
								<a-select-option value="1"> 1~20个(24元/个) </a-select-option>
								<a-select-option value="2"> 21~100个(22元/个) </a-select-option>
								<a-select-option value="3">
									101-1999个(20元/个
								</a-select-option>
								<a-select-option value="4">
									2000个以上(19元/个)
								</a-select-option>
							</a-select>
						</a-form-item>

						<a-form-item label="来源类型">
							<a-select
								v-decorator="[
									'SourceType',
									{
										rules: [{ required: true, message: '请选择来源类型' }],
									},
								]"
								placeholder="请选择来源类型"
							>
								<a-select-option value="1"> 用户购买 </a-select-option>
								<a-select-option value="2"> 赠送 </a-select-option>
								<a-select-option value="3"> 公司自用 </a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="订单截图">
							<!-- style="display: none;" -->
							<a-input
								placeholder="订单截图"
								autocomplete="off"
								style="display: none"
								v-decorator="[
									'ImgUrl',
									{
										rules: [{ required: true, message: '请上传订单截图' }],
									},
								]"
							/>
							<img
								v-if="addFormModel.ImgUrl"
								:src="addFormModel.ImgUrl"
								alt="订单截图"
								style="width: 100px; height: 100px; float: left"
								@click="openPreview"
							/>
							<a-upload
								:action="uploadAction"
								list-type="picture"
								:showUploadList="false"
								class="upload-list-inline"
								@change="handleChange"
								:before-upload="beforeUpload"
								style="
									float: left;
									display: inline-block;
									margin-left: 10px;
									margin-top: -5px;
								"
							>
								<a-button type="primary" :loading="uploadLoading">
									<a-icon type="upload" />上传截图</a-button
								>
							</a-upload>
						</a-form-item>
						<a-form-item label="备注">
							<a-textarea
								placeholder="备注"
								autocomplete="off"
								:rows="3"
								v-decorator="[
									'Remarks',
									{
										rules: [],
									},
								]"
							/>
						</a-form-item>
						<a-form-item label=" ">
							<a-button
								:disabled="addDisabled"
								type="primary"
								:loading="addLoading"
								@click="addHandleOk"
								size="large"
								>生成
							</a-button>
							<a-button @click="addReset" size="large" style="margin-left: 10px"
								>清空
							</a-button>
						</a-form-item>
					</a-form>
				</div>
				<div
					style="width: 50%; float: left; padding-left: 15px; padding-top: 4px"
				>
					<div>生成结果：</div>
					<a-textarea
						style="background-color: #ebebeb; margin-top: 5px"
						placeholder="生成激活码结果,点击复制"
						:rows="8"
						read-only=""
						v-model="creteCodeStr"
						@click="copyCodeList"
					/>
					<p style="color: rgb(64, 158, 255)">提示：点击输入框，即可复制</p>
				</div>
			</div>
		</a-modal>

		<a-modal
			:visible="previewVisible"
			:footer="null"
			@cancel="previewHandleCancel"
		>
			<img alt="example" style="width: 100%" :src="previewImage" />
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
import { CardCodeList } from '@/api/kefu/cardCodeApi.js'
import { CreateCardCodeOrder } from '@/api/kefu/cardCodeOrderApi.js'
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
					title: '使用状态',
					key: 'UseStatus',
					width: '150px',
					scopedSlots: { customRender: 'UseStatus' },
				},
				{
					title: '使用时间',
					Key: 'UseTime',
					width: '180px	',
					dataIndex: 'UseTime',
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
			isCustomerService: false, //是否客服
			tableLoading: false,
			addVisible: false,
			addLoading: false,
			addConfirmLoading: false,
			addDisabled: false,
			addFormModel: {
				ImgUrl: '',
				TkId: '',
				OrderNo: '',
				OrderAmout: '',
				CodeCount: '',
				CardCodeType: '1',
				SourceType: '1',
				RebateType: '1',
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
			creteCodeStr: '',
			uploadAction: 'http://192.168.11.129:30080/api/UploadFile/Image',
			uploadLoading: false,
			previewVisible: false,
			previewImage: '',
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
			this.addReset()
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
						this.isSupplier = res.Data.IsSupplier
						this.isAdmin = res.Data.IsAdmin
					} else {
						tipMessage.error('获取激活码失败')
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
				content: `确定将【${v.transferInfo.transferCount}】个激活码转让给用户【${v.transferInfo.tkInfo.label}】?`,
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
		addHandleOk() {
			this.addForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					values.TkId *= 1
					values.SourceType *= 1
					values.RebateType *= 1
					values.CardCodeType *= 1
					values.CodeCount *= 1
					values.OrderAmout *= 1
					console.log('addForm values: ', values)
					this.addLoading = true
					CreateCardCodeOrder(values)
						.then((res) => {
							if (res.IsSuccess) {
								this.query()
								//	this.addVisible = false
								var str = ''
								res.Data.forEach((code) => {
									str += code + '\r\n'
								})

								this.creteCodeStr = str
								this.addDisabled = true
								tipMessage.success('创建卡密成功')
							} else {
								tipMessage.error(res.Msg)
							}
							this.addLoading = false
						})
						.catch(() => {
							this.addLoading = false
						})
				}
			})
		},
		addHandleCancel() {
			this.addVisible = false
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
		copyCodeList() {
			console.log('复制生成结果')

			this.$copyText(this.creteCodeStr).then(
				function (e) {
					// alert('Copied')
					tipMessage.success('复制结果成功')
				},
				function (e) {
					// alert('Can not copy')
					// console.log(e)
					tipMessage.error('复制结果失败,可能是浏览器不支持')
				}
			)
		},
		handleChange(info) {
			if (info.file.status === 'uploading') {
				this.uploadLoading = true
				return
			}
			if (info.file.status === 'done') {
				if (info.fileList.length > 0) {
					var imageUrl =
						info.fileList[info.fileList.length - 1].response.Data.Url
					this.addFormModel.ImgUrl = imageUrl
					this.uploadLoading = false
					this.addForm.setFieldsValue({
						ImgUrl: imageUrl,
					})
					info.fileList.length = 0
				} else {
					tipMessage.error('上传截图失败,请稍后再试')
				}
			}
		},
		beforeUpload(file) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
			if (!isJpgOrPng) {
				this.$message.error('请上传png或jpg图片!')
			}
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				tipMessage.error('图片必须小于2M')
			}

			var res = isJpgOrPng && isLt2M
			// if (res) {
			// 	this.addFormModel.ImgUrl = ''
			// 	this.addForm.setFieldsValue({
			// 		ImgUrl: '',
			// 	})
			// }
			return res
		},
		previewHandleCancel() {
			this.previewVisible = false
		},
		openPreview() {
			if (this.addFormModel.ImgUrl) {
				this.previewImage = this.addFormModel.ImgUrl
				this.previewVisible = true
			}
		},
		addReset() {
			this.$nextTick(() => {
				this.creteCodeStr = ''
				this.addForm.setFieldsValue({
					ImgUrl: '',
					TkId: '',
					OrderNo: '',
					OrderAmout: '',
					CodeCount: '',
					CardCodeType: '1',
					SourceType: '1',
					RebateType: '1',
				})
				this.addFormModel.ImgUrl = ''
				this.addDisabled = false
			})
		},
		handleConfirmPass(rule, value, callback) {
			if (this.password && this.password !== value) {
				callback('两次密码输入不一致！')
			}
			// Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
			callback()
		},
	},
	created() {
		this.query()
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
