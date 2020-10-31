<template>
	<div class="user">
		<a-card title="我的账号">
			<p class="tip">
				此账号配置的信息为淘客信息，PID使用优先级：群PID>工位PID>用户PID>淘客PID
			</p>
			<a-table
				:columns="columns"
				:dataSource="mydata"
				rowKey="Id"
				:loading="mytableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
				<template slot="editRemarks" slot-scope="text, row">
					<editable-cell
						:text="text"
						placeholder="请输入备注"
						@change="remarksChange(row, 'Remarks', $event, 1)"
						editTitle="编辑备注"
						:maxLength="remarksMaxLength"
					/>
				</template>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					<a-switch
						checked-children="开"
						un-checked-children="关"
						:checked="!!row.Status == 1"
						@change="editStatus(row, 1)"
					/>
				</div>
				<div class="table operation" slot="opti" slot-scope="row">
					<a-button type="primary" @click="workstationManage(row)" size="small"
						>工位管理</a-button
					>
					<a-button type="primary" @click="setConfig(row)" size="small"
						>指定配置</a-button
					>
					<a-button type="primary" @click="addWorkstation(row, 1)" size="small"
						>创建工位</a-button
					>
					<a-button type="primary" @click="setGroup(row)" size="small"
						>指定分组</a-button
					>
					<!-- <a type="link" @click="edit(row,1)">编辑信息</a> -->
					<a-button type="primary" @click="goAgent(row)" size="small"
						>登录代理</a-button
					>
					<a-button type="primary" size="small" @click="updatePwd(row, 1)"
						>修改密码</a-button
					>
				</div>
			</a-table>
		</a-card>
		<a-card title="用户列表" style="margin-top: 10px">
			<p class="tip">
				此账号配置的信息为用户信息，PID使用优先级：群PID>工位PID>用户PID>淘客PID
			</p>
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>

				<a-form-item label="备注">
					<a-input v-model="form.Remark" placeholder="请输入关键词" />
				</a-form-item>
				<a-form-item label="发单状态">
					<a-select style="width: 120px" v-model="form.Status">
						<a-select-option value="-1">全部</a-select-option>
						<a-select-option value="1">开启</a-select-option>
						<a-select-option value="0">关闭</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
					<a-button
						type="primary"
						style="margin-left: 15px"
						icon="plus-circle"
						@click="addUser"
						>添加用户</a-button
					>
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
				<template slot="editRemarks" slot-scope="text, row">
					<editable-cell
						ref=""
						:text="text"
						@change="remarksChange(row, 'Remarks', $event, 2)"
						editTitle="编辑备注"
						:maxLength="remarksMaxLength"
					/>
				</template>

				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					<a-switch
						checked-children="开"
						un-checked-children="关"
						:checked="!!row.Status == 1"
						@change="editStatus(row, 2)"
					/>
				</div>
				<!-- <span slot="Status" slot-scope="row"><a-switch id="row_{{row.id}}" checked='' @change="onChange" /></span> -->
				<div class="table operation" slot="opti" slot-scope="row">
					<a-button type="primary" @click="workstationManage(row)" size="small"
						>工位管理</a-button
					>
					<a-button type="primary" @click="setConfig(row)" size="small"
						>指定配置</a-button
					>
					<a-button type="primary" @click="addWorkstation(row, 2)" size="small"
						>创建工位</a-button
					>
					<a-button type="primary" @click="setGroup(row)" size="small"
						>指定分组</a-button
					>
					<!-- <a type="link" @click="edit(row,1)">编辑信息</a> -->
					<a-button type="primary" @click="goAgent(row)" size="small"
						>登录代理</a-button
					>
					<a-button type="primary" size="small" @click="updatePwd(row, 2)"
						>修改密码</a-button
					>
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
			title="创建用户"
			:visible="visible"
			@ok="addHandleOk"
			@cancel="addHandleCancel"
		>
			<a-form :form="aform" :model="addInfo" :rules="addRules" ref="aform">
				<h3>PID优先级：群PID>工位PID>用户PID>淘客PID</h3>
				<a-form-item v-bind="formItemLayout" label="用户名" prop="userName">
					<a-input placeholder="登录用户名" v-decorator="addRules.userName" />
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="密码" prop="pwd">
					<a-input-password
						placeholder="登录密码"
						autocomplete="new-password"
						v-decorator="addRules.pwd"
					/>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="账号状态" prop="status">
					<a-radio-group v-decorator="addRules.status">
						<a-radio :value="1"> 启用</a-radio>
						<a-radio :value="0"> 禁用</a-radio>
					</a-radio-group>
				</a-form-item>

				<a-form-item
					v-bind="formItemLayout"
					label="淘宝授权账号"
					prop="TaoBaoSessionId"
				>
					<a-select
						ref="sltTaoBaoSessionId"
						placeholder="请选择淘宝授权账号"
						v-decorator="addRules.TaoBaoSessionId"
					>
						<a-select-option v-for="d in tbSessionData" :key="d.Id">{{
							d.Name
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item
					v-bind="formItemLayout"
					label="淘宝联盟Pid"
					prop="TaoBaoPid"
				>
					<a-input
						ref="tbTaoBaoPid"
						placeholder="请输入淘宝联盟Pid"
						autocomplete="off"
						v-decorator="addRules.TaoBaoPid"
					/>
				</a-form-item>

				<a-form-item
					v-bind="formItemLayout"
					label="淘宝联盟Rid"
					prop="TaoBaoRid"
				>
					<a-input
						placeholder="请输入淘宝联盟Rid"
						autocomplete="off"
						v-decorator="addRules.TaoBaoRid"
					/>
				</a-form-item>

				<a-form-item
					v-bind="formItemLayout"
					label="多多进宝授权账号"
					prop="PddSessionId"
				>
					<a-select
						ref="sltPddSessionId"
						placeholder="请选择多多进宝账号"
						v-decorator="addRules.PddSessionId"
					>
						<a-select-option v-for="d in pddSessionData" :key="d.Id">{{
							d.Name
						}}</a-select-option>
					</a-select>
				</a-form-item>

				<a-form-item v-bind="formItemLayout" label="多多进宝Pid" prop="PddPid">
					<a-input
						ref="tbPddSessionId"
						placeholder="请输入多多进宝Pid"
						autocomplete="off"
						v-decorator="addRules.PddPid"
					/>
				</a-form-item>

				<a-form-item
					v-bind="formItemLayout"
					label="拼多多自定义参数"
					prop="PddTip"
				>
					<a-input
						placeholder="请输入拼多多自定义参数"
						v-decorator="addRules.PddTip"
						autocomplete="off"
					/>
				</a-form-item>
				<a-form-item v-bind="formItemLayout" label="备注" prop="remark">
					<a-input
						placeholder="用户备注"
						autocomplete="off"
						v-decorator="addRules.remark"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<!-- <a-modal title="编辑信息" :visible="editVisible" @ok="editHandleOk" @cancel="editHandleCancel">
			<a-form :form="editform" :model="editInfo">
				<a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-input v-model="editInfo.userName" read-only />
				</a-form-item>
				<a-form-item label="账号状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-radio-group v-model="editInfo.status" :options="statusOptions"></a-radio-group>
				</a-form-item>
				<a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-input v-model="editInfo.remark" placeholder="用户备注" autocomplete="off" />
				
				</a-form-item>
			</a-form>
		</a-modal>-->
		<SetUserPasswordCom
			:platformType="1"
			:isUseDefault="false"
			ref="setUserPassword"
			@onSuccess="setUserPasswordSuccess"
			@onCancel="setUserPasswordCancel"
		></SetUserPasswordCom>
		<BasicsConfig :configType="1" ref="basicsConfig"></BasicsConfig>
		<SetClassifyGroup :targetType="1" ref="setClassifyGroup"></SetClassifyGroup>
	</div>
</template>

<script>
import moment from 'moment'
import EditableCell from '@/components/Table/EditableCell.vue'
import SetUserPasswordCom from '@/components/User/SetUserPassword.vue'
import BasicsConfig from '@/components/Config/BasicsConfig.vue'
import SetClassifyGroup from '@/components/ClassifyGroup/SetClassifyGroup.vue'
import tipMessage from '@/utils/messageUtil.js'
import {
	UserList,
	CreatUser,
	UpdateUserStatus,
	UpdateUserRemark,
	dlLogin,
} from '@/api/tk/userApi.js'
import { CreateWorkstation } from '@/api/tk/workstationApi.js'
import { authorizeList } from '@/api/tk/authorizeApi.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name'

export default {
	name: 'user',
	components: {
		EditableCell,
		BasicsConfig,
		SetClassifyGroup,
		SetUserPasswordCom,
	},
	data() {
		return {
			remarksMaxLength: 50,
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
				Remark: '',
				Status: '-1',
				UserName: '',
				pageSize: 20,
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
							{
								pattern: /^[a-zA-Z0-9]{6,18}$/g,
								message: '密码必须为6-18位的字母数字',
							},
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
					width: '80px',
					dataIndex: 'Id',
				},
				{
					title: '用户名',
					Key: 'UserName',
					width: '150px',
					dataIndex: 'UserName',
				},
				{
					title: '备注',
					Key: 'Remarks',
					width: '200px',
					dataIndex: 'Remarks',
					scopedSlots: { customRender: 'editRemarks' },
				},
				{
					title: '发单状态',
					key: 'Status',
					width: '100px',
					scopedSlots: { customRender: 'opSwitchStatus' },
				},
				{
					title: '创建时间',
					Key: 'CTime',
					width: '150px',
					dataIndex: 'CTime',
				},
				{
					title: '工位数',
					Key: 'WorkstationCount',
					width: '100px',
					dataIndex: 'WorkstationCount',
				},

				{
					title: '操作',
					scopedSlots: { customRender: 'opti' },
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
			tbSessionData: [
				// { Id: 1, Nick: 'nicheng1', SessionKey: 'tbSessionKeytest1' },
				// { Id: 2, Nick: 'nicheng2', SessionKey: 'tbSessionKeytest2' }
			],
			pddSessionData: [
				// { Id: 1, Nick: 'pddnk1', SessionKey: 'pddSessionKeytest1' },
				// { Id: 2, Nick: 'pddnk2', SessionKey: 'pddSessionKeytest2' }
			],
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
		remarksChange(row, key, value, type) {
			if (!value) return
			if (value.length > 50) {
				tipMessage.error('备注不能超过50个字')
				//this.$refs.SurveyForm.callApi()
				this.$refs.userWithdrawalCom.query()
				return
			}
			UpdateUserRemark(row.Id, value)
				.then((res) => {
					if (res.IsSuccess) {
						this.query()
						tipMessage.success('保存成功')
						//	tipMessage.success
					} else {
						tipMessage.error(res.Msg)
					}
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		editStatus(row, type) {
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
						this.$router.push({
							path: '/user/workstation?userName=' + row.UserName,
						})
					} else {
						tipMessage.error(res.msg)
					}

					if (isTk) {
						this.mytableLoading = false
					} else {
						this.tableLoading = false
					}
				})
				.catch(() => {
					if (isTk) {
						this.mytableLoading = false
					} else {
						this.tableLoading = false
					}
				})
		},
		setGroup(row) {
			this.$refs.setClassifyGroup.openSetClassify(row)
		},
		goAgent(row) {
			console.log(11, row)
			dlLogin({
				Id: row.Id,
			})
				.then((res) => {
					window.open('./dl.html#/dl')
				})
				.catch((err) => {})
		},
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
			this.$nextTick(() => {
				this.aform.setFieldsValue({
					userName: '',
					pwd: '',
					status: 1,
					remark: '',
				})
			})
		},
		addHandleOk() {
			//e.preventDefault()
			this.aform.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log('addform values: ', values)
					if (values.TaoBaoSessionId > 0) {
						if (values.TaoBaoPid == null || values.TaoBaoPid.length <= 0) {
							this.$nextTick(() => {
								this.$refs.tbTaoBaoPid.focus()
							})
							tipMessage.error('请输入淘宝PId')
							return
						}
					}
					//检查淘宝授权
					if (values.TaoBaoPid) {
						if (!values.TaoBaoSessionId || values.TaoBaoSessionId <= 0) {
							this.$nextTick(() => {
								this.$refs.sltTaoBaoSessionId.focus() //输入框默认获取焦点
							})
							tipMessage.error('请选择淘宝授权账号')
							return
						}
					}

					if (values.PddSessionId > 0) {
						if (values.PddPid == null || values.PddPid.length <= 0) {
							this.$nextTick(() => {
								this.$refs.tbPddSessionId.focus()
							})
							tipMessage.error('请输入多多进宝Pid')
							return
						}
					}
					//检查pdd授权
					if (values.PddPid) {
						if (!values.PddSessionId || values.PddSessionId <= 0) {
							this.$nextTick(() => {
								this.$refs.sltPddSessionId.focus()
							})
							tipMessage.error('请选择多多进宝授权账号')
							return
						}
					}
					CreatUser(values)
						.then((res) => {
							tipMessage.success('用户创建成功')
							this.query()
							this.visible = false
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
		setUserPasswordSuccess(obj) {
			console.log('obj', obj)
			if (obj == 1) {
				this.queryTk()
			} else if (obj == 2) {
				this.query()
			}
		},
		updatePwd(row, type) {
			var isTk = type == 1
			if (isTk) {
				this.mytableLoading = true
			} else {
				this.tableLoading = true
			}
			this.$refs.setUserPassword.openUpdatePwd(row, type)
		},
		setUserPasswordCancel(obj) {
			this.hideLoading(obj)
		},
		hideLoading(type) {
			var isTk = type == 1
			if (isTk) {
				this.mytableLoading = false
			} else {
				this.tableLoading = false
			}
		},
	},
	created() {
		this.queryTk()
		this.query()
		this.getTbSession()
		this.getPddSession()
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
