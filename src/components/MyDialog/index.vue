<template>
	<div class="my-dialog components">
		<div class="title">{{ title }}</div>
		<div class="content">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {}
	},
	props: ['title'],
}
</script>