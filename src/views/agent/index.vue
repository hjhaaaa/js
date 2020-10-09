<template>
	<div>
	代理主页
	</div>
</template>

<script>
import moment from 'moment'
import EditableCell from '@/components/Table/EditableCell.vue'
import tipMessage from '@/utils/messageUtil.js'
import {
	UserList,
	UpdateUserStatus,
	UpdateUserRemark
} from '@/api/userApi.js'

export default {
	name: 'user',
	components: { EditableCell },
	data() {
		return {
        }
	},
	methods: {

	},
	created() {
		
	}
}
</script>

<style lang="scss" scoped>

</style>
