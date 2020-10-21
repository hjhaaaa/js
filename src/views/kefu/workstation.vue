<template>
	<div class="workstation">
		<a-card title="工位列表" :bordered="false">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<!-- <div class="searchrow"> -->
				<a-form-item label="工位Id">
					<a-input v-model="form.Id" placeholder="请输入工位Id" />
				</a-form-item>
				<a-form-item label="用户名">
					<a-input v-model="form.UserName" placeholder="请输入用户名" />
				</a-form-item>
				<a-form-item label="工位状态">
					<a-select
						style="width: 150px"
						v-model="form.Status"
						:options="statusOptions"
					></a-select>
				</a-form-item>
				<a-form-item label="微信状态">
					<a-select
						v-model="form.WxStatus"
						:options="wxStatusOptions"
					></a-select>
				</a-form-item>
				<a-form-item label="充值类型">
					<a-select
						style="width: 120px"
						v-model="form.RechageType"
						:options="rechageTypeOptions"
					></a-select>
				</a-form-item>
				<a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>
				<!-- </div> -->
			</a-form>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
				<div slot="UserNameSlot" slot-scope="row">
					{{ row.UserName }}
					<div>
						<a-tag v-if="row.StationType == 1" color="blue">淘客</a-tag>
					</div>
				</div>
				<div slot="Status" slot-scope="row">
					<p>{{ row.WorkStatus == 2 ? '启用' : '禁用' }}</p>
				</div>
				<div slot="StationRechageTypeSlot" slot-scope="row">
					<a-tag v-if="row.StationRechageType == 2" color="purple"
						>增强版</a-tag
					>
					<a-tag v-else-if="row.StationRechageType == 1" color="blue"
						>普通版</a-tag
					>

					<a-tag v-if="isShowExpireTag(row)" color="red">即将到期</a-tag>

					<div v-if="row.StationRechageType != 0">
						{{ formatDate(row.StartTime) }}至{{ formatDate(row.EndTime) }}
					</div>
				</div>
				<div slot="wxStatus" slot-scope="row">
					<div v-if="row.WxLogStatus == 1">
						<a-tag color="#87d068">在线</a-tag>
						<p>最近登录：</p>
						<p>{{ row.OnLineTime || ' ' }}</p>
					</div>
					<div v-else>
						<a-tag>离线</a-tag>
						<p>最近离线：</p>
						<p>{{ row.OffLineTime || ' ' }}</p>
					</div>
				</div>
				<div slot="opSwitchStatus" class="wxOp" slot-scope="row">
					{{ !!row.SwitchStatus ? '开启' : '关闭' }}
				</div>
				primary
			</a-table>
			<div style="margin-top: 15px">
				<a-pagination
					size="small"
					:pageSize.sync="form.pageSize"
					v-model="form.pageNum"
					@change="pageChange"
					:total="total"
					showQuickJumper
					:showTotal="(total) => `共${total}条`"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'
import $ from 'jquery'
import '@/assets/js/signalr.min.js'
import { WorkstationList } from '@/api/workstatusApi.js'
import { constants } from 'zlib'
import { callbackify, log } from 'util'
import { deeppink } from 'color-name'
export default {
	name: 'user-workstation',
	components: {},
	data() {
		return {
			statusOptions: [
				{ label: '全部', value: -1 },
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
				{ label: '三天内到期', value: 2 },
			],
			wxStatusOptions: [
				{ label: '全部', value: -1 },
				{ label: '在线', value: 1 },
				{ label: '离线', value: 0 },
			],
			rechageTypeOptions: [
				{ label: '全部', value: -1 },
				{ label: '未充值', value: 0 },
				{ label: '普通版', value: 1 },
				{ label: '增强版', value: 2 },
			],
			aform: this.$form.createForm(this),
			formItemLayout: {
				labelCol: {
					sm: { span: 7 },
				},
				wrapperCol: {
					sm: { span: 12 },
				},
			},
			form: {
				Id: '',
				Remark: '',
				Status: -1,
				UserName: '',
				pageSize: 10,
				pageNum: 1,
				WxStatus: -1,
				RechageType: -1,
			},
			columns: [
				{
					title: '工位Id',
					width: '100px',
					dataIndex: 'Id',
				},
				{
					title: '用户名',
					width: '200px',
					scopedSlots: { customRender: 'UserNameSlot' },
				},
				{
					title: '设备号',
					width: '300px',
					dataIndex: 'Uid',
				},
				{
					title: '微信状态',
					width: '180px',
					scopedSlots: { customRender: 'wxStatus' },
				},
				{
					title: '充值类型',
					width: '200px',
					scopedSlots: { customRender: 'StationRechageTypeSlot' },
				},
				{
					title: '工位状态',
					width: '150px',
					scopedSlots: { customRender: 'Status' },
				},

				{
					title: '发单状态',
					width: '200px',
					scopedSlots: { customRender: 'opSwitchStatus' },
				},
				{
					title: '创建时间',
					width: '200px',
					dataIndex: 'CTime',
				},
				// {
				// 	title: '操作',
				// 	width: '200px',
				// 	scopedSlots: { customRender: 'opti' },
				// },
			],
			visible: false, //添加用户
			data: [],
			total: 0,
			tableLoading: false,
		}
	},
	mounted() {
		var $this = this
	},
	methods: {
		query() {
			this.tableLoading = true
			WorkstationList(this.form)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		handleSearch() {
			this.form.pageNum = 1
			this.query()
		},
		pageChange(p, s) {
			this.form.pageNum = p
			this.query()
		},
		isShowExpireTag(row) {
			// console.log(row)
			if (!row.EndTime) {
				return false
			}
			var nowTime = moment()
			var workEndTime = moment(row.EndTime)
			var duration = moment.duration(workEndTime.diff(nowTime))
			//  console.log('duration', duration)
			return duration._data.days <= 7
		},
		formatDate(time) {
			if (!time) {
				return ' '
			}
			return moment(time).format('YYYY-MM-DD')
		},
	},
	created() {
		// console.log("params:",	this.$route.query)
		this.form.UserName = this.$route.query.userName
		this.query()
	},
}
</script>

<style lang="scss" scoped>
.workstation {
	.ant-table-body {
		overflow-x: auto !important;
	}
	.setRole-content {
		height: 400px;
		.left-block,
		.btnbox-block,
		.right-block {
			float: left;
			width: 180px;
			height: 400px;
		}
		.left,
		.right {
			width: 180px;
			height: 400px;
			border: 1px solid #ccc;
			overflow: auto;
			.ant-btn-primary {
				margin-bottom: 10px;
			}
		}
		.btnbox-block {
			width: 100px;
			border: 0 none;
		}
	}
	.table.operation button {
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.tip {
		margin-bottom: 10px;
	}
	.WXAvatar {
		width: 80px;
		height: 80px;
	}
	.wxOp button:not(:last-child) {
		margin-bottom: 4px;
	}
	.searchrow {
		margin-bottom: 5px;
	}
	.wxlogin div p {
		padding-left: 24px;
		line-height: 30px;
	}
	.wxlogin img {
		margin-right: auto;
		margin-left: auto;
	}
}
</style>

