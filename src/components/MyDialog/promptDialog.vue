<template>
	<div class="promptDialog">
		<a-modal
			v-model="visible"
			:title="title"
			ok-text="确认"
			cancel-text="取消"
			@ok="handleOk"
			@cancel="handleCancel"
		>
			<a-form :form="form" :rules="rules" ref="form">
				<!-- label="密码" v-bind="formItemLayout" -->
				<a-form-item>
					<a-textarea
						:placeholder="placeholder"
						v-decorator="rules.text"
						rows="4"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
export default {
	name: 'PromptDialogComponent',
	props: {
		title: {
			type: String,
			default: '提示',
		},
		placeholder: {
			type: String,
			default: '请输入内容',
		},
		errorMessage: {
			type: String,
			default: '内容不能为空!',
		},
		visible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			form: this.$form.createForm(this),
			rules: {
				text: [
					'text',
					{
						rules: [
							{
								required: true,
								message:  this.errorMessage,
							},
						],
					},
				],
			},
		}
	},
	methods: {
		handleOk() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					this.$emit('ok', values.text)
				}
			})
		},
		handleCancel() {
			// this.$emit('callback')
			this.$emit('cancel')
		},
	},
}
</script>
<style lang="scss" scoped>
.promptDialog {
}
</style>