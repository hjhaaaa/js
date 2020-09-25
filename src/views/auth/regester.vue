<template>
	<div class="border-bottom: 1px solid #ebedf0; padding: 42px 24px 50px; color: rgba(0,0,0,.65);">
		<a-form :form="form" @submit="handleSubmit">
			<a-form-item v-bind="formItemLayout" label="Phone Number">
				<a-input
					v-decorator="[
          'phone',
          {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          },
        ]"
					style="width: 100%"
				>
					<a-select
						disabled
						slot="addonBefore"
						v-decorator="['prefix', { initialValue: '86' }]"
						style="width: 70px"
					>
						<a-select-option value="86">+86</a-select-option>
					</a-select>
				</a-input>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="Phone code">
				<a-input
					v-decorator="[
          'code',
          {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          },
        ]"
					style="width: 100%">
					<a-button slot="addonAfter" type="link" style="height: 30px;">获取验证码</a-button>
				</a-input>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="Password" has-feedback>
				<a-input
					v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: '请输入登录密码!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          },
        ]"
					type="password"
				/>
			</a-form-item>
			<a-form-item v-bind="formItemLayout" label="Confirm Password" has-feedback>
				<a-input
					v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]"
					type="password"
					@blur="handleConfirmBlur"
				/>
			</a-form-item>

			<a-form-item v-bind="tailFormItemLayout">
				<a-checkbox v-decorator="['agreement', { valuePropName: 'checked' }]">
					I have read the
					<a href>agreement</a>
				</a-checkbox>
			</a-form-item>
			<a-form-item v-bind="tailFormItemLayout">
				<a-button type="primary" html-type="submit">Register</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			confirmDirty: false,
			residences,
			autoCompleteResult: [],
			formItemLayout: {
				labelCol: {
					xs: { span: 24 },
					sm: { span: 8 }
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 16 }
				}
			},
			tailFormItemLayout: {
				wrapperCol: {
					xs: {
						span: 24,
						offset: 0
					},
					sm: {
						span: 16,
						offset: 8
					}
				}
			}
		}
	},
	beforeCreate() {
		this.form = this.$form.createForm(this, { name: 'register' })
	},
	methods: {
		handleSubmit(e) {
			e.preventDefault()
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values)
				}
			})
		},
		handleConfirmBlur(e) {
			const value = e.target.value
			this.confirmDirty = this.confirmDirty || !!value
		},
		compareToFirstPassword(rule, value, callback) {
			const form = this.form
			if (value && value !== form.getFieldValue('password')) {
				callback('Two passwords that you enter is inconsistent!')
			} else {
				callback()
			}
		},
		validateToNextPassword(rule, value, callback) {
			const form = this.form
			if (value && this.confirmDirty) {
				form.validateFields(['confirm'], { force: true })
			}
			callback()
		},
		handleWebsiteChange(value) {
			let autoCompleteResult
			if (!value) {
				autoCompleteResult = []
			} else {
				autoCompleteResult = ['.com', '.org', '.net'].map(
					domain => `${value}${domain}`
				)
			}
			this.autoCompleteResult = autoCompleteResult
		}
	}
}
</script>

<!--<template>
	<div class="regester">
		<a-form :form="form" class="login-form" :wrapper-col="wrapperCol">
			<a-form-item>
				<a-input
					v-decorator="[ 'phone',  {  rules: [ { required: true, message: '请输入手机号' } ], validateTrigger: 'change'   }   ]"
					size="large"
					placeholder="用户名"
				>
					<a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
				</a-input>
			</a-form-item>
			<a-form-item>
				<a-col :span="10">
					<a-input
						v-decorator="[
                  'verificateCode',
                  {
                    rules: [
                      { required: true, message: '请输入验证码' },
                      { validator: validate }
                    ],
                    validateTrigger: 'blur',
                    validateFirst: true
                  }
                ]"
						@pressEnter="handleLogin"
						size="large"
						placeholder="验证码"
					>
						<a-icon slot="prefix" type="safety" :style="{ color: 'rgba(0,0,0,.25)' }" />
					</a-input>
				</a-col>
				<a-col :span="12" :offset="2">
					<validate-code ref="validate-code" @change="code => validateCode = code"></validate-code>
				</a-col>
				<a-form-item>
					<a-input
						v-on:keyup.enter="handleLogin"
						v-decorator="[
                  'password',
                  {
                    rules: [
                      { required: true, message: '请输入密码' },
                      { pattern: /^[a-zA-Z0-9]{4,16}$/g, message: '密码必须为4-16位的字母数字组合' }
                    ],
                    validateTrigger: 'blur'
                  }
                ]"
						size="large"
						type="password"
						autocomplete="false"
						placeholder="密码"
					>
						<a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
					</a-input>
				</a-form-item>
			</a-form-item>
		
			<a-form-item style="margin-top: 24px; margin-bottom: 0;">
				<a-button
					@click="handleLogin"
					:loading="loading"
					:disabled="loading"
					size="large"
					type="primary"
					class="login-button"
				>登录</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import ValidateCode from '@/components/ValidateCode'
import LayoutFooter from '@/components/Layout/App/LayoutFooter'
import { encryptpwd } from '@/utils'
import { timeFix } from '@/utils/time'

export default {
	components: { ValidateCode, LayoutFooter },
	data() {
		return {
			form: this.$form.createForm(this),
			validateCode: '',
			loading: false
		}
	},
	methods: {
		...mapActions('user', ['Login']),
		handleLogin() {
			this.loading = true
			this.form.validateFields((err, { username, password }) => {
				if (err) {
					setTimeout(() => {
						this.loading = false
					}, 600)
					return
				}
				this.Login({
					LoginName: username,
					LoginPwd: password
				})
					.then(res => this.loginSuccess(res))
					.catch(res => this.requestFailed(res))
					.finally(() => (this.loading = false))
			})
		},
		loginSuccess(res) {
			// localStorage.removeItem('selectcol')
			this.$nextTick(() => {
				this.$router.push('/home')
			})

			// 延迟 1 秒显示欢迎信息
			setTimeout(() => {
				this.$notification.success({
					message: '欢迎',
					description: `${timeFix()}，欢迎回来`
				})
			}, 1000)
		},
		requestFailed(err) {
			// this.$notification.error({
			//   message: '错误',
			//   description: (err || {}).msg || '请求出现错误，请稍后再试',
			//   duration: 4
			// })
		},
		validate(rule, value, callback) {
			if (value.toUpperCase() !== this.validateCode) {
				callback(new Error('验证码输入错误，请重新输入'))
			}
			callback()
		},
	}
}
</script>

<style lang="less" scoped>
.login {
	position: relative;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f0f2f5 url('../../assets/images/login_bg.jpg');
	background-size: cover;
	background-repeat: no-repeat;

	.logo-wrapper {
		margin-bottom: 38px;
		text-align: center;
		user-select: none;

		.logo {
			display: inline-block;
			width: 80px;
			margin-right: 16px;
			vertical-align: -30px;
		}

		.title {
			font-size: 32px;
			font-weight: bolder;
			font-family: 'Ink Free';
		}
	}

	.login-form {
		margin: 0 auto;

		.login-button {
			padding: 0 15px;
			font-size: 16px;
			height: 40px;
			width: 100%;
		}
	}

	.login-footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 16px;
		margin: 48px 0 24px;
	}
}
</style>
-->