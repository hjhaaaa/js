<template>
	<div class="authorize">
		<a-card title="账号授权">
			<div>
				<a-button
					type="primary"
					@click="addTbsq"
					style="margin-right: 16px; margin-bottom: 10px"
					>授权添加淘宝联盟账号</a-button
				>
				<a-button type="primary" @click="addPddsq"
					>授权添加多多进宝账号</a-button
				>
			</div>
			<div>
				<a-tabs default-active-key="tb" @change="tabChange">
					<a-tab-pane key="tb" tab="淘宝联盟授权"> </a-tab-pane>
					<a-tab-pane key="dd" tab="多多进宝授权"> </a-tab-pane>
					<a-tab-pane key="jd" tab="京东联盟授权" disabled> </a-tab-pane>
				</a-tabs>

				<a-table
					:columns="columns"
					:dataSource="list"
					rowKey="Id"
					:pagination="false"
					:scroll="{ x: 600 }"
				>
					<template slot="PlatformType" slot-scope="row">{{
						row.PlatformType | PlatformTypeFilter
					}}</template>
					<template slot="EndTime" slot-scope="row">
						{{ row.EndTime }}
						<a
							:style="
								'color: ' +
								(row.EndTimeTips == '已过期' ? '#ff4d4f' : '#faad14')
							"
							href="javascript:;"
							>{{ row.EndTimeTips || '' }}</a
						>
					</template>
					<template slot="caozuo" slot-scope="row">
						<a
							href="javascript:0;"
							v-if="listQuery.PlatformType == 1"
							@click="addTbsq"
							>更新授权</a
						>
						<a
							href="javascript:0;"
							v-if="listQuery.PlatformType == 2"
							@click="addPddsq"
							>更新授权</a
						>
					</template>
				</a-table>
			</div>
			<div style="margin-top: 15px">
				<a-pagination
					size="small"
					:pageSize.sync="listQuery.PageSize"
					v-model="listQuery.PageNum"
					@change="pageChange"
					:total="total"
					@showSizeChange="onShowSizeChange"
					showSizeChanger
					showQuickJumper
					:showTotal="(total) => `共${total}条`"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import { authorizeList, authorizeOauthcheck } from '@/api/tk/authorizeApi.js'
import { authorizeOauthPddcheck } from '@/api/tk/authorizePddApi.js'
export default {
	name: 'authorize',
	data() {
		return {
			list: [],
			listQuery: {
				PageNum: 1,
				PageSize: 20,
				PlatformType: 1,
			},
			total: 0,
			columns: [
				{
					title: '序号',
					align: 'center',
					dataIndex: 'Id',
				},
				{
					title: '联盟类型',
					align: 'center',
					scopedSlots: { customRender: 'PlatformType' },
				},
				{
					title: '账号',
					align: 'center',
					dataIndex: 'Name',
				},
				{
					title: '授权时间',
					align: 'center',
					dataIndex: 'SessionTime',
				},
				{
					title: '过期时间',
					align: 'center',
					scopedSlots: { customRender: 'EndTime' },
				},
				{
					title: '操作',
					align: 'center',
					scopedSlots: { customRender: 'caozuo' },
				},
			],
		}
	},
	created() {
		this.query()
	},
	mounted() {
		// 授权失败会有提示 以弹窗形式展现
		if (this.$route.query.ErrorMsg) {
			this.$error({
				title: '授权错误',
				content: this.$route.query.ErrorMsg,
				onOk: () => {
					location.replace(location.href.substr(0, location.href.indexOf('?')))
				},
			})
		}
	},
	methods: {
		addTbsq() {
			authorizeOauthcheck({
				returnUrl: location.href,
			}).then((res) => {
				// window.open(
				// 'https://oauth.taobao.com/authorize' +
				// 	'?response_type=code' +
				// 	'&client_id=26014808' +
				// 	'&redirect_uri=yfdoauth.sitezt.cn/api/wyfd/tk/newoauthcallback' +
				// 	'&state=' +
				// 	resState
				// )
				location.href = res.Data

				// location.href =
				// 	'https://oauth.taobao.com/authorize' +
				// 	'?response_type=code' +
				// 	'&client_id=26014808' +
				// 	'&redirect_uri=yfdoauth.sitezt.cn/api/wyfd/tk/newoauthcallback' +
				// 	'&state=' +
				// 	resState
			})
		},
		addPddsq() {
			authorizeOauthPddcheck({
				returnUrl: location.href,
			}).then((res) => {
				//console.log('res', res)
				location.href = res.Data
				// let resState = res.Data
				// location.href =
				// 	'https://ddjb.pinduoduo.com/open.html' +
				// 	'?client_id=013d1ace79ea4bb0bc75716c26151e29' +
				// 	'&response_type=code' +
				// 	'&redirect_uri=http%3A%2F%2yfdcallbacktest.comzt.cn%3A30080%2Fapi%2Fwyfd%2FUserPddOauth%2FOauthPddCallBack' +
				// 	'&state=' +
				// 	resState
			})
		},
		query() {
			authorizeList(this.listQuery).then((res) => {
				res.Data.forEach((value) => {
					let nowTime = new Date().getTime()
					let valTime = new Date(value.EndTime).getTime()
					value.EndTimeTips = ''
					if (valTime <= nowTime) {
						value.EndTimeTips = '已过期'
					} else if (valTime <= nowTime + 3 * 86400000) {
						value.EndTimeTips = '即将过期'
					}
				})
				this.list = res.Data
				this.total = res.TotalCount
			})
		},
		tabChange(t) {
			console.log(t)
			this.listQuery.PageNum = 1
			if (t == 'tb') {
				this.listQuery.PlatformType = 1
			} else if (t == 'dd') {
				this.listQuery.PlatformType = 2
			} else if (t == 'jd') {
				this.listQuery.PlatformType = 3
			}
			this.query()
		},
		pageChange(p, s) {
			this.listQuery.PageNum = p
			this.query()
		},
		onShowSizeChange(p, s) {
			this.listQuery.PageSize = s
			this.query()
		},
	},
	filters: {
		PlatformTypeFilter(val) {
			let _val = ''
			if (val == 1) _val = '淘宝'
			if (val == 2) _val = '拼多多'
			if (val == 3) _val = '京东'
			return _val
		},
		EndTimeFilter(val) {
			let _val = val
			let _nowTime = new Date().getTime()
			let _valTime = new Date(val).getTime()
			console.log(_nowTime, _valTime)
			return _val + '<a>1111</a>'
		},
	},
}
</script>

<style lang="scss">
.authorize {
	.ant-table-body {
		overflow-x: auto !important;
	}
}
</style>

<style lang="scss" scoped>
.authorize {
}
</style>


