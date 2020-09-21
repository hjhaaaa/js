<template>
	<div>
		<a-card title="用户列表" :bordered="false">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="用户名">
					<a-input v-model="form.userName"/>
				</a-form-item>
				<a-form-item>
					<a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
					<a-button style="margin-left: 15px" type="primary" icon="search" @click="addUser">添加</a-button>
				</a-form-item>
			</a-form>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
			>
				<span slot="Enable" slot-scope="row">{{row.Enable==0?'禁用':'启用'}}</span>
				<div slot="opti" slot-scope="row">
					<a-button style="margin-right:10px;" type="primary" @click="editGroup(row)">分配权限</a-button>
					<a-button type="primary" @click="edit(row)">修改</a-button>
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
		<a-modal :title="gTitle" :visible="visible" @ok="handleOk" @cancel="handleCancel">
			<a-form :form="aform" :model="temp">
				<a-form-item label="账号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-input v-decorator="['Name', { rules: [{ required: true, message: '请输入账号!' }] }]"/>
					<!-- <a-input v-model="temp.Name"/> -->
				</a-form-item>
				<a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-input
						v-decorator="['Pwd', { rules: [{ required: true, message: '请输入密码!' },{validator:checkAmount}] }]"
					/>
					<!-- <a-input v-model="temp.Pwd"/> -->
				</a-form-item>
				<a-form-item label="邮箱" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-input v-decorator="['Email', { rules: [{validator:checkEmail}] }]"/>
					<!-- <a-input v-model="temp.Email"/> -->
				</a-form-item>
				<a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-radio-group v-model="temp.Enable" name="Enable" :default-value="1">
						<a-radio :value="1">启用</a-radio>
						<a-radio :value="0">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
					<a-input v-decorator="['Des', { rules: [{validator:checktextarea}] }]"/>
					<!-- <a-input v-model="temp.Des"/> -->
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal title="设置权限" :visible="visible2" @cancel="CloseWin" @ok="OTSetRole">
			<div class="setRole-content">
				<div class="left-block">
					<div class="title">未有权限</div>
					<div class="left">
						<a-button
							type="primary"
							@click="addToHaveRole(item)"
							v-for="item in NoCheckMeun"
							:key="item.Id"
						>{{item.Title}}</a-button>
					</div>
				</div>
				<div class="btnbox-block"></div>
				<div class="right-block">
					<div class="title">已有权限</div>
					<div class="right">
						<a-button
							type="primary"
							@click="addToNoHaveRole(item)"
							v-for="item in CheckMeun"
							:key="item.Id"
						>{{item.Title}}</a-button>
					</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment'
// import { mgCpsList, cpsdropdownlist } from '@/api/auth.js'
import ValidateCode from '@/components/ValidateCode'
import { UsersList, CreatUser, GetMenu, SetMenu } from '@/api/auth.js'
import { constants } from 'zlib'
import { callbackify } from 'util'
import { deeppink } from 'color-name';
export default {
	name: 'tk-user',
	components: { ValidateCode },
	data() {
		let validatorPhone = (rule, value, callback) => {
			// 如果为空值，就抛出错误
			if (!value) {
				callback(new Error('请输入手机号!'))
			} else {
				// 正则判断手机号格式的格式，正则判断失败抛出错误，否则直接callback()
				if (!/^1[2-9]\d{9}$/.test(value)) {
					callback(new Error('手机号格式不正确!'))
				} else {
					callback()
				}
			}
		}
		return {
			aform: this.$form.createForm(this),
			form: {
				userName: '',
				pageSize: 20,
				pageNum: 1
			},
			temp: {
				Id: '',
				Name: '',
				Pwd: '',
				Enable: 1,
				Email: '',
				Des: ''
			},
			columns: [
				{
					title: 'Id',
					dataIndex: 'Id'
				},
				{
					title: '用户名',
					Key: 'Name',
					dataIndex: 'Name'
				},
				{
					title: '邮箱',
					Key: 'Email',
					dataIndex: 'Email'
				},
				{
					title: '登陆IP',
					Key: 'LastLoginIp',
					dataIndex: 'LastLoginIp'
				},
				{
					title: '状态（启用/禁用）',
					key: 'Enable',
					scopedSlots: { customRender: 'Enable' }
				},
				{
					title: '创建时间',
					Key: 'CTime',
					dataIndex: 'CTime'
				},
				{
					title: '最后登录时间',
					Key: 'LastLoginTime',
					dataIndex: 'LastLoginTime'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'opti' }
				}
			],
			gTitle: '添加用户',
			visible: false, //添加用户
			visible2: false, //设置权限

			data: [],
			total: 0,
			curUserId: '',
			tableLoading: false,
			CheckMeun: [],
			NoCheckMeun: [],
			rules: {
				Name: [{ validator: validatorPhone, trigger: 'change' }] // validator对应手机格式验证方法（注意必须要有callback） // trigger对应触发验证的条件。取值有change(表单值改变时触发)；blur(表单元素失去焦点时触发)
			}
		}
	},
	methods: {
		query() {
			this.tableLoading = true
			UsersList(this.form)
				.then(res => {
					this.data = res.PData
					this.total = res.TotalCount
					this.tableLoading = false
					console.log(this.data)
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
		addUser() {
			this.visible = true
			this.temp = Object.assign(
				{},
				{
					Id: '',
					Name: '',
					Pwd: '',
					Enable: 1,
					Email: '',
					Des: ''
				}
			)
		},
		editGroup(row) {
			this.visible2 = true
			this.curUserId = row.Id
			GetMenu({ userId: row.Id })
				.then(res => {
					this.NoCheckMeun = res.NotChecked
					this.CheckMeun = res.Checked
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		edit(row) {
			this.visible = true
			this.temp = Object.assign(
				{},
				{
					Id: row.Id,
					Name: row.Name,
					Pwd: row.Pwd,
					Enable: row.Enable,
					Email: row.Email,
					Des: row.Des
				}
			)
		},
		handleOk() {
			// debugger;
			// console.log(aform);
			this.aform.validateFields((err, {Id,Name,Pwd,Enable,Email,Des}) => {
				if (!err) {
					// console.log('Received values of form: ', values)
					CreatUser({Id,Name,Pwd,Enable,Email,Des})
						.then(res => {
							if (res.code == 0) {
								this.visible = false
								this.$message.success('操作成功')
								this.query()
							} else {
								this.$message.error(res.msg)
							}
						})
						.catch(() => {
							this.tableLoading = false
						})
				}
			})
		},
		handleCancel() {
			this.visible = false
		},
		CloseWin() {
			this.visible2 = false
		},
		checkName(rule, value, callback) {},
		//把没有的权限丢到已有的里面
		addToHaveRole(val) {
			this.NoCheckMeun.forEach((item, i) => {
				if (item.Id == val.Id) {
					this.CheckMeun.push(val)
					this.NoCheckMeun.splice(i, 1)
				}
			})
		},

		addToNoHaveRole(val) {
			this.CheckMeun.forEach((item, i) => {
				if (item.Id == val.Id) {
					this.NoCheckMeun.push(val)
					this.CheckMeun.splice(i, 1)
				}
			})
		},
		OTSetRole() {
			let Mid = []
			this.CheckMeun.forEach(item => {
				Mid.push(item.Id)
			})
			SetMenu({ UserId: this.curUserId, MenuIds: Mid })
				.then(res => {
					console.log(res)
					if (res.code == 0) {
						this.$message.success('提交成功')
						this.visible2 = false
						this.query()
					} else {
						this.$message.error(res.msg)
					}
				})
				.catch(() => {})
		},
		//一些校验
		checkAmount(rule, value, callback) {
			console.log('xx_xx', value)
			// var regex = new RegExp(
			// 	'^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$'
			// )
			var regex = new RegExp('^[\u4E00-\u9FA5A-Za-z0-9]+$');
			if (!regex.test(value) || value < 0) {
				// 如果需要返回 error msg，就把它传给 `callback()`
				callback('只能包含英文和数字')
			} else {
				// 如果通过校验，调用无参数的 `callback()` 即可
				callback()
			}
		},
		//邮箱校验
		checkEmail(rule, value, callback) {
			if (!value) {
				callback()
				return
			}
			var regex = new RegExp(
				'^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
			)
			if (!regex.test(value) || value < 0) {
				// 如果需要返回 error msg，就把它传给 `callback()`
				callback('请输入正确的邮箱')
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
</style>
