<template>
	<div>
		<a-card title="全民免单数据" :bordered="false">
			<a-form layout="inline" :form="form" style="margin-bottom: 10px">
				<a-form-item label="日期">
					<a-date-picker v-model="form.cdata" />
				</a-form-item>
				<a-form-item>
					<a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
					<a-button style="margin-left: 15px" type="primary" @click="daochu">导出</a-button>
				</a-form-item>
			</a-form>

			<a-table
				:columns="columns"
				:dataSource="data"
				:row-key="(r,i)=>{i.toString()}"
				:loading="tableLoading"
				:pagination="false"
			>
				<span slot="CDate" slot-scope="row">{{row.CDate ? row.CDate.slice(0, 10) : ''}}</span>
			</a-table>
			<div style="margin-top: 15px">
				<a-pagination
					size="small"
					:pageSize.sync="form.pageSize"
					v-model="form.page"
					@change="pageChange"
					:total="total"
					showQuickJumper
					:showTotal="total => `共${total}条`"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import moment from 'moment'
import { mgfreedaydatalist } from '@/api/auth.js'
export default {
	name: 'tk-qmmdtj',
	data() {
		return {
			form: {
				cdata: null,
				pageSize: 20,
				page: 1,
			},
			columns: [
				{
					title: '日期',
					width: 120,
					key: 'CDate',
					scopedSlots: { customRender: 'CDate' },
				},
				{
					title: '浏览新用户数',
					align: 'right',
					dataIndex: 'SeeNewUCount',
				},
				{
					title: '浏览老用户数',
					align: 'right',
					dataIndex: 'SeeOldUCount',
				},
				{
					title: '分享页新增用户数',
					align: 'right',
					dataIndex: 'ShareAddUCount',
				},
				{
					title: '分享页登录新增用户数',
					align: 'right',
					dataIndex: 'ShareAddLoginUCount',
				},
				// {
				//   title: '商品点击数',
				//   align: 'right',
				//   dataIndex: 'MdNewUXdCount',
				// },
				// {
				//   title: '商品点击人数',
				//   align: 'right',
				//   dataIndex: 'MdNewUXdCount2',
				// },{
				//   title: '分享点击人数',
				//   align: 'right',
				//   dataIndex: 'OpenMdTkCount',
				// },{
				//   title: '分享点击数',
				//   align: 'right',
				//   dataIndex: 'OpenMdTkCount',
				// },
				{
					title: '总订单数',
					align: 'right',
					dataIndex: 'TotalOrderCount',
				},
				{
					title: '总补贴金额',
					align: 'right',
					dataIndex: 'SumSubAmount',
				},
			],
			data: [],
			total: 0,
			tableLoading: false,
		}
	},
	methods: {
		query() {
			var params = Object.assign({}, this.form, {
				cdata: this.form.cdata
					? moment(this.form.cdata).format('YYYY-MM-DD')
					: '',
			})
			this.tableLoading = true
			mgfreedaydatalist(params)
				.then((res) => {
					if (res && res.PData) {
            const data = res.PData
            data.forEach(d => {
              d.SumSubAmount = (d.SumSubAmount / 100).toFixed(2)
            })
						this.data = data
						this.total = res.TotalCount
						this.tableLoading = false
					}
				})
				.catch(() => {
					this.tableLoading = false
				})
		},
		handleSearch() {
			this.form.page = 1
			this.query()
		},
		daochu() {
			let params = Object.assign({}, this.form, {
				cdata: this.form.cdata
					? moment(this.form.cdata).format('YYYY-MM-DD')
					: '',
			})
			delete params.page
			delete params.pageSize
			let paramsArr = []
			for (var i in params) {
				paramsArr.push(i + '=' + params[i])
			}

			window.open(
				'/api/d/mgfree/mgfreedaydatalistexport?' + paramsArr.join('&')
			)
		},
		pageChange(p, s) {
			this.form.page = p
			this.query()
		},
	},
	created() {
		this.query()
	},
}
</script>

<style lang="scss" scoped>
</style>
