<template>
    <div class="add-edit-temp">
        <a-card title="模板名称">
            <a-form :form="form">
                <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="模板名称"
                >
                <a-input
                    v-decorator="[
                    'username',
                    { rules: [{ required: true, message: '请输入模板名称' }] },
                    ]"
                    placeholder="接粉入群（群名称）"
                />
                </a-form-item>
                <a-form-item
                :label-col="formItemContent.labelCol"
                :wrapper-col="formItemContent.wrapperCol"
                label="内容"
                >
                <a-input
                    v-decorator="[
                    'nickname',
                    { rules: [{ required: true, message: '请输入内容 1' }] },
                    ]"
                    placeholder="内容 1"
                />
                </a-form-item>
                <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
                <!-- <a-form-item> -->
                <a-button type="primary" @click="check">
                    Check
                </a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 4 },
};
const formItemContent = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};
// 按钮
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
export default {
  data() {
    return {
    //   checkNick: false,
      formItemLayout,
      formItemContent,
      formTailLayout,
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
    };
  },
  methods: {
    check() {
      console.log('this.form----', this.form)
      this.form.validateFields(err => {
        if (!err) {
          console.info('success');
        }
      });
    },
  },
};
</script>