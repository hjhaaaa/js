<template>
	<div class="editable-cell">
		<div v-if="editable" class="editable-cell-input-wrapper">
			<a-input :value="value" @change="handleChange" @pressEnter="check" />
			<!-- <a-textarea :value="value" @change="handleChange" @pressEnter="check" :auto-size="{ minRows: 3, maxRows: 6 }" /> -->
			<!-- <a-icon type="check" class="editable-cell-icon-check" @click="check" /> -->
			<div class="action">
				<a type="link" class="editable-cell-icon-save" @click="check">保存</a>
				<a
					type="link"
					style="margin-left: 10px"
					class="editable-cell-icon-check"
					@click="cancel"
					title="取消"
					>取消</a
				>
			</div>
		</div>
		<div v-else class="editable-cell-text-wrapper">
			<span class="aaa">{{ value || ' ' }}</span>
			<!-- <a-textarea :value="value" @pressEnter="check" :auto-size="{ minRows: 3, maxRows: 6 }"  /> -->
			<a
				type="link"
				class="editable-cell-icon-check"
				@click="edit"
				:title="editTitle"
				>编辑</a
			>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		text: String,
		editTitle: String,
		openEdit: function () {
			editable = true
		},
		closeEdit: function () {
			editable = false
		},
	},
	data() {
		return {
			value: this.text,
			editable: false,
		}
	},
	methods: {
		handleChange(e) {
			const value = e.target.value
			this.value = value
		},
		check() {
			this.editable = false
			this.$emit('change', this.value)
		},
		edit() {
			this.editable = true
		},
		cancel() {
			this.editable = false
		},
	},
}
</script>
<style>

	.editable-cell {
		position: relative;
	}
	.editable-cell-input-wrapper input {
		width: 100%;
	}
	.editable-cell-text-wrapper {
		padding: 5px 1px 5px 5px;
	}

	.editable-cell-icon,
	.editable-cell-icon-check {
		cursor: pointer;
	}

	.editable-cell-icon {
		line-height: 18px;
		font-size: 18px;
		display: inline-block;
	}

	.editable-cell-icon:hover,
	.editable-cell-icon-check:hover {
		color: #108ee9;
	}

	.editable-cell .editable-add-btn {
		margin-bottom: 8px;
	}
	.editable-cell .aaa {
		display: inline-block;
		padding: 5px 24px 5px 5px;
		height: 17px;
		box-sizing: border-box;
		width: 80%;
	}
	.action {
		text-align: right;
	}

</style>