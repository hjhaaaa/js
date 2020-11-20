<template>
	<div class="regester">
		<a-card style="width: 460px;" :body-style="{padding: '60px'}">
			<div class="regester-wrapper">
				<span class="title">用户注册</span>
			</div>

			<a-form :form="form" class="regester-form">
				<a-form-item>
					<a-input
						v-decorator="[
							'Mobile',
							{
								rules: [
									{ required: true, message: '请输入手机号' },
									{ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' }
								],
								validateTrigger: 'blur'
							}
						]"
						size="large"
						autocomplete="off"
						placeholder="手机号"
					>
						<a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
					</a-input>
				</a-form-item>

				<a-form-item>
					<a-input
						v-decorator="[
							'Pwd',
							{
								rules: [
									{ required: true, message: '请输入密码' },
									{ pattern: /^[a-zA-Z0-9]{6,18}$/g, message: '密码必须为6-18位的字母数字' }
								],
								validateTrigger: 'blur'
							}
						]"
						size="large"
						type="password"
						placeholder="密码"
					>
						<a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
					</a-input>
				</a-form-item>

				<a-form-item>
					<a-input
						v-decorator="[
							'Pwd2',
							{
								rules: [
									{ required: true, message: '请确认密码' },
									{ pattern: /^[a-zA-Z0-9]{6,18}$/g, message: '密码必须为6-18位的字母数字' }
								],
								validateTrigger: 'blur'
							}
						]"
						size="large"
						type="password"
						placeholder="确认密码"
					>
						<a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
					</a-input>
				</a-form-item>

				<a-form-item>
          <a-col :span="12">
            <a-input
              v-decorator="[
								'Code',
								{
									rules: [
										{ required: true, message: '请输入验证码' },
									],
									validateTrigger: 'blur',
									validateFirst: true
								}
							]"
              size="large"
							autocomplete="off"
              placeholder="验证码"
            >
              <a-icon slot="prefix" type="safety" :style="{ color: 'rgba(0,0,0,.25)' }" />
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
						>{{fasongText}}</a-button>
          </a-col>
				</a-form-item>
<!-- { required: true, message: '请输入邀请码' } -->
				<a-form-item>
					<a-input
						v-decorator="[
							'InviteCode',
							{
								rules: [
									
								],
								validateTrigger: 'blur'
							}
						]"
						size="large"
						autocomplete="off"
						placeholder="邀请码"
					>
						<a-icon slot="prefix" type="user-add" :style="{ color: 'rgba(0,0,0,.25)' }" />
					</a-input>
				</a-form-item>

				<a-form-item style="margin-bottom: 10px;">
					<a-button
						@click="handleRegester"
						:loading="loading"
						:disabled="loading"
						size="large"
						type="primary"
						style="width: 100%"
					>注册</a-button>
				</a-form-item>
				<a-form-item style="text-align: center;margin-bottom: 0px;">
					<a-button type="link" @click="goLogin">已注册，去登录</a-button>
				</a-form-item>
			</a-form>
		</a-card>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { RegesterCode, Regester } from '@/api/auth'

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			loading: false,
			fasongLoading: false,
			fasongDisabled: false,
			fasongText: '发送'
		}
	},
	methods: {
		...mapActions('user', ['Login']),
		handleRegester() {
			this.form.validateFields((err, data) => {
				if (err) {
					return
				}
				if(data.Pwd !== data.Pwd2){
					return this.$message.error('两次输入密码不一致')
				}
				this.loading = true
				Regester(data).then(res => {
					this.loading = false
					if(res.IsSuccess){
						this.$message.success('注册成功');
						this.goLogin()
					}else{
						this.$message.error(res.Msg);
					}
				}).catch(() => {
					this.loading = false
				})

			})
		},
		fasongCode(){
			this.form.validateFields(['Mobile'], (err, data) => {
				console.log(err, data)
				if(!err){
					this.fasongLoading = true
					this.fasongDisabled = true
					RegesterCode({mobile: data.Mobile}).then((res) => {
						this.fasongLoading = false
						if(res.IsSuccess){
							this.fasongText = '重新发送（60）'
							this.timeDown()
						}else{
							this.fasongDisabled = false
							this.$message.error(res.Msg);
						}
					}).catch((error) => {
						this.fasongLoading = false
						this.fasongDisabled = false
					})
				}else{
					this.$message.error(err.Mobile.errors[0].message)
				}
			})
		},
		goLogin() {
			this.$router.push('/login');
		},
		timeDown(){
			let timeNum = 60
			let timer = setInterval(() => {
				timeNum--
				if(timeNum <= 0){
					this.fasongText = `重新发送`
					this.fasongDisabled = false
					clearInterval(timer)
				}else{
					this.fasongText = `重新发送（${timeNum}）`
				}
			}, 1000)
		},
	}
}
</script>

<style lang="less" scoped>
.regester {
	position: relative;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #f0f2f5 url('../../assets/images/login_bg.jpg');
	background-size: cover;
	background-repeat: no-repeat;
	.regester-wrapper {
		margin-bottom: 38px;
		text-align: center;
		.title {
			font-size: 32px;
			font-weight: bolder;
			font-family: 'Ink Free';
		}
	}

	.regester-form {
		margin: 0 auto;
	}
}
</style>