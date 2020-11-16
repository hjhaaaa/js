<template>
	<div>
		<a-card title="模板管理">
			<a-form layout="inline" :form="listQuery" style="margin-bottom: 10px">
				<a-form-item label="开始日期">
					<a-date-picker
						v-model="listQuery.startDate"
						valueFormat="YYYY-MM-DD"
						placeholder="开始日期"
					/>
				</a-form-item>
				<a-form-item label="结束日期">
					<a-date-picker
						v-model="listQuery.endDate"
						valueFormat="YYYY-MM-DD"
						placeholder="结束日期"
					/>
				</a-form-item>
				<a-form-item label="模板名称">
					<a-input v-model="listQuery.TemplateName" placeholder="请输入模板名称" />
				</a-form-item>

                <a-form-item>
					<a-button icon="search" @click="handleSearch">查询</a-button>
				</a-form-item>

				<a-form-item>
					<a-button type="primary" icon="plus-circle">创建模板</a-button>
				</a-form-item>
			</a-form>
			<a-table
				:columns="columns"
				:dataSource="data"
				rowKey="Id"
				:loading="tableLoading"
				:pagination="false"
				:scroll="{ x: 1000 }"
			>
            	<div class="table operation" slot="opti" slot-scope="row">
					<a-button type="primary" @click="updateTemplate(row)" size="small"
						>编辑</a-button
					>
                    <a-button type="primary" @click="handleDelete(row)" size="small"
						>删除</a-button
					>
				</div>
			</a-table>

			<div style="margin-top: 15px">
				<a-pagination
					size="small"
					:pageSize.sync="listQuery.pageSize"
					v-model="listQuery.pageNum"
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
import { PushMessageTemplateList, DeletePushMessageTemplate } from '@/api/tk/templateApi.js'
import moment from 'moment'
import tipMessage from '@/utils/messageUtil.js'

export default {
    name: 'templateList',
    data() {
        return {
            data: [],
			total: 0,
			tableLoading: false,
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
            listQuery: {
				TemplateName: '',
                startDate: undefined,
                endDate: undefined,
				pageSize: 10,
				pageNum: 1
            },
            columns: [
				{
					title: '创建时间',
					Key: 'CTime',
					width: '120px',
					dataIndex: 'CTime'
                },
                {
					title: '模板名称',
					Key: 'TemplateName',
					width: '120px',
					dataIndex: 'TemplateName'
                },
                {
					title: '模板内容',
					Key: 'TemplateContentStr',
					width: '120px',
					dataIndex: 'TemplateContentStr'
                },
                {
					title: '备注',
					Key: 'TemplateRemark',
					width: '120px',
					dataIndex: 'TemplateRemark'
                },
                {
                    title: '操作',
                    width: '200px',
					scopedSlots: { customRender: 'opti' },
				}
            ]
        }
    },
    methods: {
        getList() {
			this.tableLoading = true
            let params = Object.assign({}, this.listQuery)
			PushMessageTemplateList(params)
				.then((res) => {
					this.data = res.Data
					this.total = res.TotalCount
					this.tableLoading = false
				})
				.catch(() => {
					this.tableLoading = false
				})
        },
        moment,
        handleSearch() {
			this.listQuery.pageNum = 1
			this.getList()
		},
        handleFilter() {
            this.listQuery.pageNum = 1
            this.getList()
        },
        pageChange(p, s) {
			this.listQuery.pageNum = p
			this.getList()
        },
        handleDelete(row) {
            let that = this
            this.$confirm({
				title: '此操作将永久删除该文件, 是否继续?',
				onOk(){
                    DeletePushMessageTemplate(row)
                        .then((res) => {
                            if (res.IsSuccess) {
                                this.query()
                                tipMessage.success('操作成功')
                            } else {
                                tipMessage.error(res.Msg)
                            }
                        })
                        .catch(() => {
                            that.tableLoading = false
                        })
				},
				onCancel() {}
			})
        }
    },
    created() {
		this.getList()
	}
}    
</script>
<style scoped>
	.table.operation button {
		margin-bottom: 5px;
		margin-right: 5px;
	}
</style>