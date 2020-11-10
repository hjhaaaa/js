<template>
	<div class="login">
		<a-card style="width: 460px" :body-style="{ padding: '60px' }">
			<div class="logo-wrapper">
				<img src="../../assets/images/logo.png" class="logo" alt="背景图" />
				<span class="title">用户登录</span>
			</div>

			<a-form :form="form" class="login-form">
				<a-form-item>
					<a-input
						v-decorator="[
							'username',
							{
								rules: [
									{ required: true, message: '请输入用户名' },
									{ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' },
								],
								validateTrigger: 'change',
							},
						]"
						size="large"
						placeholder="用户名"
					>
						<a-icon
							slot="prefix"
							type="user"
							:style="{ color: 'rgba(0,0,0,.25)' }"
						/>
					</a-input>
				</a-form-item>

				<a-form-item v-if="loginType == 1">
					<a-input
						v-on:keyup.enter="handleLogin"
						v-decorator="[
							'password',
							{
								rules: [
									{ required: true, message: '请输入密码' },
									{
										pattern: /^[a-zA-Z0-9]{4,16}$/g,
										message: '密码必须为4-16位的字母数字组合',
									},
								],
								validateTrigger: 'blur',
							},
						]"
						size="large"
						type="password"
						autocomplete="false"
						placeholder="密码"
					>
						<a-icon
							slot="prefix"
							type="lock"
							:style="{ color: 'rgba(0,0,0,.25)' }"
						/>
					</a-input>
				</a-form-item>
				<a-form-item v-if="loginType == 2">
					<a-col :span="12">
						<a-input
							v-decorator="[
								'code',
								{
									rules: [{ required: true, message: '请输入验证码' }],
									validateTrigger: 'blur',
									validateFirst: true,
								},
							]"
							size="large"
							autocomplete="off"
							placeholder="验证码"
						>
							<a-icon
								slot="prefix"
								type="safety"
								:style="{ color: 'rgba(0,0,0,.25)' }"
							/>
						</a-input>
					</a-col>
					<a-col :span="10" :offset="2">
						<a-button
							@click="fasongCode"
							:loading="fasongLoading"
							:disabled="fasongDisabled"
							size="large"
							type="primary"
							style="width: 100%"
							>{{ fasongText }}</a-button
						>
					</a-col>
				</a-form-item>
				<a-form-item style="margin-top: 24px; margin-bottom: 10px">
					<a-button
						@click="handleLogin"
						:loading="loading"
						:disabled="loading"
						size="large"
						type="primary"
						class="login-button"
						>登录</a-button
					>
				</a-form-item>
				<a-form-item style="text-align: center; margin-bottom: 0px">
					<a-button type="link" @click="showRegesterModal">新用户注册</a-button>
					<a-button type="link" @click="loginToggle">{{
						loginType == 1 ? '短信登录' : '密码登录'
					}}</a-button>
				</a-form-item>
			</a-form>
		</a-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import ValidateCode from '@/components/ValidateCode'
import { encryptpwd } from '@/utils'
import { timeFix } from '@/utils/time'
import { LoginCode } from '@/api/auth'

export default {
	components: { ValidateCode },
	data() {
		return {
			form: this.$form.createForm(this),
			validateCode: '',
			loading: false,
			fasongText: '发送',
			fasongLoading: false,
			fasongDisabled: false,
			loginType: 1,
		}
	},
	methods: {
		...mapActions('user', ['Login']),
		handleLogin() {
			this.loading = true
			let validateArr = ['username', 'password']
			if (this.loginType == 2) {
				validateArr = ['username', 'code']
			}
			this.form.validateFields(validateArr, (err, data) => {
				if (err) {
					setTimeout(() => {
						this.loading = false
					}, 600)
					return
				}
				this.Login({
					UserName: data[validateArr[0]],
					Pwd: data[validateArr[1]],
					Type: this.loginType,
				})
					.then((res) => this.loginSuccess(res))
					.catch((res) => this.requestFailed(res))
					.finally(() => (this.loading = false))
			})
		},
		loginSuccess(res) {
			if (res.IsSuccess) {
				this.$nextTick(() => {
					this.$router.push('/home')
				})

				// 延迟 1 秒显示欢迎信息
				setTimeout(() => {
					this.$notification.success({
						message: '欢迎',
						description: `${timeFix()}，欢迎回来`,
					})
				}, 1000)
			} else {
				this.$message.error(res.Msg)
			}
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
		showRegesterModal() {
			this.$router.push('/regester')
		},
		loginToggle() {
			if (this.loginType == 1) {
				this.loginType = 2
			} else {
				this.loginType = 1
			}
		},
		fasongCode() {
			this.form.validateFields(['username'], (err, data) => {
				console.log(err, data)
				if (!err) {
					this.fasongLoading = true
					this.fasongDisabled = true
					LoginCode({ mobile: data.username })
						.then((res) => {
							this.fasongLoading = false
							if (res.IsSuccess) {
								this.fasongText = '重新发送（60）'
								this.timeDown()
							} else {
								this.fasongDisabled = false
								this.$message.error(res.Msg)
							}
						})
						.catch((error) => {
							this.fasongLoading = false
							this.fasongDisabled = false
						})
				} else {
					this.$message.error(err.username.errors[0].message)
				}
			})
		},
		timeDown() {
			let timeNum = 60
			let timer = setInterval(() => {
				timeNum--
				if (timeNum <= 0) {
					this.fasongText = `重新发送`
					this.fasongDisabled = false
					clearInterval(timer)
				} else {
					this.fasongText = `重新发送（${timeNum}）`
				}
			}, 1000)
		},
	},
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
}
</style>