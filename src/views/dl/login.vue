<template>
  <div class="dl_login">
    <a-form :form="form">
      <a-form-item>
        <a-input
          v-decorator="[
            'UserName',
            { rules: [{ required: true, message: '请输入账号！' }] },
          ]"
          placeholder="账号"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'Pwd',
            { rules: [{ required: true, message: '请输入密码！' }] },
          ]"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="width: 100%" @click="login">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { dlLogin } from '@/api/dl'

export default {
  name: 'dl_login',
  data(){
    return {
      form: this.$form.createForm(this),
    }
  },
  created() {
    
  },
  methods: {
    login(){
      this.form.validateFields((err, { UserName, Pwd }) => {
        dlLogin({UserName, Pwd}).then(res => {
          this.$router.push('dl')
        }).catch(err => {

        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.dl_login{
  padding: 0.2rem;
}
</style>

