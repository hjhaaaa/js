<template>
  <div class="group-index">
    <a-card title="分组管理">
      <div>
        开启分组
        <a-switch checked-children="开" un-checked-children="关" :checked="checked" @change="onChange" />
        <span style="font-size: 12px;color: red;vertical-align: -1px;">
          开启分组后，可以自由配置发单方案。
          <a href="javascript:;">查看教程</a>
        </span>
      </div>
      <div>
        <a-form layout="inline" :form="form" @submit="handleSubmit">

        </a-form>
      </div>
      <div>

      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    
  },
  methods: {
    onChange(val){
      console.log(val)
    }
  },
}
</script>

<style lang="scss" scoped>
  .group-index{
    
  }
</style>



