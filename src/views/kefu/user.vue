<template>
	<div class="user">
		<a-card title="用户列表">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>

				<!-- <a-form-item label="备注">
					<a-input v-model="form.Remark" placeholder="请输入关键词" />
				</a-form-item> -->
				<a-form-item label="发单状态">
					<a-select style="width: 120px" v-model="form.Status">
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="1">开启</a-select-option>
						<a-select-option value="0">关闭</a-select-option>
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
				:scroll="{ x: 1000 }"
			>
				<div slot="StationTypeSlot" class="wxOp" slot-scope="row">
					<!-- <a-tag v-if="row.UserLevel == 1" color="blue">淘客</a-tag>
					<a-tag v-else color="blue">代理</a-tag> -->

					{{ !!row.UserLevel == 1 ? '淘客' : '代理' }}
				</div>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					{{ !!row.Status == 1 ? '开启' : '关闭' }}
				</div>
				<div slot="action" class="wxOp" slot-scope="row">
					<a-button type="primary" size="small">修改密码</a-button>
					<a-button type="primary" size="small">设置供应商</a-button>
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
	</div>
</template>

<script>
import moment from 'moment'
import EditableCell from '@/components/Table/EditableCell.vue'
import BasicsConfig from '@/components/Config/BasicsConfig.vue'
import SetClassifyGroup from '@/components/ClassifyGroup/SetClassifyGroup.vue'
import tipMessage from '@/utils/messageUtil.js'
import {
	UserList,
	CreatUser,
	UpdateUserStatus,
	UpdateUserRemark,
} from '@/api/userApi.js'
import { CreateWorkstation } from '@/api/workstatusApi.js'
import { authorizeList } from '@/api/auth.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'user',
	components: { EditableCell, BasicsConfig, SetClassifyGroup },
	data() {
		return {
			statusOptions: [
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
			],
			aform: this.$form.createForm(this),
			editform: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 8 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				IsHasSelf: true,
				Remark: '',
				Status: '-1',
				UserName: '',
				pageSize: 10,
				pageNum: 1,
			},
			addInfo: {
				userName: '',
				pwd: '',
				remark: '',
				status: 1,
				TaoBaoSessionId: undefined,
				TaoBaoPid: '',
				TaoBaoRid: '',
				PddSessionId: undefined,
				PddPid: '',
				PddTip: '',
			},
			addRules: {
				userName: [
					'userName',
					{
						rules: [
							{
								required: true,
								message: '用户名不能为空!',
							},
							// {
							// 	min: 6,
							// 	max: 30,
							// 	message: '长度在 6 到 30 个字符',
							// 	trigger: 'blur'
							// }
						],
					},
				],
				pwd: [
					'pwd',
					{
						rules: [
							{
								required: true,
								message: '密码不能为空!',
							},
							// {
							// 	min: 6,
							// 	max: 30,
							// 	message: '长度在 6 到 30 个字符',
							// 	trigger: 'blur'
							// }
						],
					},
				],
				status: [
					'status',
					{
						rules: [
							{
								required: true,
								message: '请设置账号状态!',
							},
						],
					},
				],
				remark: [
					'remark',
					{
						rules: [
							{
								min: 0,
								max: 100,
								message: '长度在不能超过300个字符',
								trigger: 'blur',
							},
						],
					},
				],
				TaoBaoSessionId: [
					'TaoBaoSessionId',
					{
						rules: [
							{
								required: false,
								message: '请选择淘宝联盟授权!',
							},
							// {
							// 	min: 6,
							// 	max: 30,
							// 	message: '长度在 6 到 30 个字符',
							// 	trigger: 'blur'
							// }
						],
					},
				],
				TaoBaoPid: [
					'TaoBaoPid',
					{
						rules: [
							{
								required: false,
								message: '请输入淘宝联盟Pid!',
							},
						],
					},
				],
				TaoBaoRid: [
					'TaoBaoRid',
					{
						rules: [
							{
								required: false,
								message: '请输入淘宝联盟Rid!',
							},
						],
					},
				],
				PddSessionId: [
					'PddSessionId',
					{
						rules: [
							{
								required: false,
								message: '请选择拼多多授权',
							},
						],
					},
				],
				PddPid: [
					'PddPid',
					{
						rules: [
							{
								required: false,
								message: '请输入多多进宝Pid!',
							},
						],
					},
				],
				PddTip: [
					'PddTip',
					{
						rules: [
							{
								required: false,
								message: '请输入拼多多自定义参数!',
							},
						],
					},
				],
			},
			editInfo: {
				id: 0,
				remark: '',
				status: 1,
			},
			columns: [
				{
					title: '序号',
					Key: 'Id',
					width: '100px',
					dataIndex: 'Id',
				},
				{
					title: '用户名',
					Key: 'UserName',
					width: '150px',
					dataIndex: 'UserName',
				},
				{
					title: '用户类型',
					width: '150px',
					scopedSlots: { customRender: 'StationTypeSlot' },
				},
				{
					title: '发单状态',
					key: 'Status',
					width: '150px',
					scopedSlots: { customRender: 'opSwitchStatus' },
				},
				{
					title: '创建时间',
					Key: 'CTime',
					width: '180px',
					dataIndex: 'CTime',
				},
				{
					title: '工位数',
					Key: 'WorkstationCount',
					width: '150px',
					dataIndex: 'WorkstationCount',
				},

				{
					title: '操作',
					width: '150px',
					scopedSlots: { customRender: 'action' },
				},
			],
			visible: false, //添加用户
			editVisible: false, //编辑信息
			editType: 0, //编辑信息
			data: [],
			mydata: [],
			total: 0,
			curUserId: '',
			tableLoading: false,
			mytableLoading: false,
			configId: 0,
		}
	},
	methods: {
		query() {
			this.tableLoading = true

			let params = Object.assign({}, this.form)
			params.Status *= 1

			UserList(params)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		queryTk() {
			this.mytableLoading = true
			UserList({
				isSelf: true,
				pageNum: 1,
				pageSize: 20,
			})
				.then((res) => {
					this.mydata = res.Data
					this.mytableLoading = false
				})
				.catch(() => {
					this.mytableLoading = false
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
		RemarksChange(row, key, value) {
			if (!value) return
			UpdateUserRemark(row.Id, value)
				.then((res) => {
					if (res.IsSuccess) {
						this.query()
						tipMessage.success('保存成功')
						//	tipMessage.success
					} else {
						tipMessage.error(res.msg)
					}
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		EditStatus(row, type) {
			//let aa = row
			let nowRow = {}
			if (type == 1) {
				nowRow = this.mydata[0]
			} else if (type == 2) {
				nowRow = this.data.find((item) => {
					return item.Id == row.Id
				})
			}
			var newValue = row.Status == 1 ? 0 : 1
			UpdateUserStatus(row.Id, newValue)
				.then((res) => {
					nowRow.Status = newValue
					tipMessage.success('操作成功')
				})
				.catch(() => {
					nowRow.Status = row.Status
				})
		},
		workstationManage(row) {
			//打开新标签页
			this.$router.push({
				path: '/user/workstation?userName=' + row.UserName,
			})
		},
		setConfig(row) {
			this.$refs.basicsConfig.openBasicsConfig(
				row.Id,
				'指定用户配置【' + row.Id + '】'
			)
		},
		addWorkstation(row, type) {
			var isTk = type == 1
			if (isTk) {
				this.mytableLoading = true
			} else {
				this.tableLoading = true
			}

			CreateWorkstation(row.Id)
				.then((res) => {
					console.log('res', res)
					if (res.IsSuccess) {
						if (isTk) {
							this.queryTk()
						} else {
							this.query()
						}

						tipMessage.success('创建工位成功')
					} else {
						tipMessage.error(res.msg)
					}

					if (isTk) {
						this.mytableLoading = true
					} else {
						this.tableLoading = true
					}
				})
				.catch(() => {
					if (isTk) {
						this.mytableLoading = true
					} else {
						this.tableLoading = true
					}
				})
		},
		setGroup(row) {
			this.$refs.setClassifyGroup.openSetClassify(row)
		},
		goAgent(row) {},
		edit(row, type) {
			this.editVisible = true
			this.editType = type
			this.editInfo = Object.assign(
				{},
				{
					id: row.Id,
					userName: row.UserName,
					status: row.Status,
					remark: row.Remarks,
				}
			)
		},
		editHandleOk() {
			// EditUserInfo(this.editInfo)
			// 	.then(res => {
			// 		if (res.IsSuccess) {
			// 			tipMessage.success('操作成功')
			// 			if (this.editType == 1) {
			// 				this.queryTk()
			// 			} else {
			// 				this.query()
			// 			}
			// 			this.editVisible = false
			// 		} else {
			// 			tipMessage.error(res.msg)
			// 		}
			// 	})
			// 	.catch(() => {
			// 		this.tableLoading = false
			// 	})
		},
		editHandleCancel() {
			this.editVisible = false
		},
		addUser() {
			this.visible = true
			this.addInfo = Object.assign(
				{},
				{
					userName: '',
					pwd: '',
					status: 1,
					remark: '',
				}
			)
			this.aform.resetFields()
		},
		addHandleOk() {
			//e.preventDefault()
			this.aform.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log('addform values: ', values)
					CreatUser(values)
						.then((res) => {
							if (res.IsSuccess) {
								tipMessage.success('用户创建成功')
								this.query()
								this.visible = false
							} else {
								tipMessage.error(res.Msg)
							}
						})
						.catch(() => {
							this.tableLoading = false
						})
				}
			})
		},
		addHandleCancel() {
			this.visible = false
		},
		CloseWin() {
			this.visible2 = false
		},
		checkName(rule, value, callback) {},

		//一些校验
		checkAmount(rule, value, callback) {
			// var regex = new RegExp(
			// 	'^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$'
			// )
			var regex = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9]+$')
			if (!regex.test(value) || value < 0) {
				// 如果需要返回 error msg，就把它传给 `callback()`
				callback('只能包含英文和数字')
			} else {
				// 如果通过校验，调用无参数的 `callback()` 即可
				callback()
			}
		},

		//备注校验
		checktextarea(rule, value, callback) {
			if (!value) {
				callback()
				return
			}
			if (value.length > 200) {
				// 如果需要返回 error msg，就把它传给 `callback()`
				callback('不要输入超过200个字')
			} else {
				// 如果通过校验，调用无参数的 `callback()` 即可
				callback()
			}
		},
		getTbSession() {
			//获取淘宝授权信息
			authorizeList({
				PlatformType: 1,
				PageNum: 1,
				PageSize: 100,
			})
				.then((res) => {
					if (res.IsSuccess) {
						this.tbSessionData = res.Data
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
		},
		getPddSession() {
			//获取拼多多授权信息
			authorizeList({
				PlatformType: 2,
				PageNum: 1,
				PageSize: 100,
			})
				.then((res) => {
					if (res.IsSuccess) {
						this.pddSessionData = res.Data
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {})
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
