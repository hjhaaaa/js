<template>
    <div class="template-box">
        <a-card title="模板管理">
            <a-form layout="inline" :form="form" style="margin-bottom: 10px;font-size: 16px">
                <a-form-item label="模板名称">
					<a-input v-model="form.TemplateName" placeholder="请输入微信昵称" />
			    </a-form-item>
                <a-form-item label="创建时间">
                    <a-date-picker
                        v-model="form.StartDate"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                    <!-- <a-range-picker
                        v-model="form.StartDate"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                    /> -->
                </a-form-item>
                <!-- <a-form-item>-</a-form-item> -->
                <a-form-item label="">
                    <a-date-picker
                        v-model="form.EndDate"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </a-form-item>
                <a-form-item>
					<a-button icon="search" type="primary" @click="handleSearch">查询</a-button>
				</a-form-item>
                <a-form-item>
					<a-button icon="plus" type="primary" @click="createdTemplate">新增模板</a-button>
				</a-form-item>
            </a-form>
            <a-table :columns="columns" :dataSource="TemplateData" rowKey="Id" :loading="tempLoading" :pagination="false" >
                <div slot="Id" slot-scope="row" align="center">
                    <div>{{row.Id}}</div>
                </div>
                <div slot="CTime" slot-scope="row" align="center">
                    <div>{{row.CTime}}</div>
                </div>
                <div slot="TemplateName" slot-scope="row" align="center">
                    <div>{{row.TemplateName}}</div>
                </div>
                <div slot="TemplateContentStr" slot-scope="row" align="center">
                    <div>{{row.TemplateContentStr.length > 10 ? row.TemplateContentStr.substring(0,10) + '...' : row.TemplateContentStr}}</div>
                </div>
                <div slot="TemplateRemark" slot-scope="row" align="center">
                    <div>{{row.Remarks}}</div>
                </div>
                <div slot="GroupName" slot-scope="row" align="center">
                    <div class="operate-dom">
                        <a class="temp-edit" @click="clickSkipEdit(row.Id, row)">编辑</a>
                        <a class="temp-del" @click="clickDelete(row.Id)">删除</a>
                    </div>
                </div>
            </a-table>
            <div style="margin-top: 50px" class="page-box">
                <a-pagination
                    size="small"
                    :pageSize="QueryList.PageSize"
                    v-model="QueryList.pageNum"
                    @change="pageChange"
                    :total="total"
                    showQuickJumper
                    :showTotal="(total) => `共${total}条`"
                />
		    </div>
                <a-modal v-model="tempVisible" title="温馨提示" :footer="null" @ok="hideModal" wrapClassName="dialog-temp">
                    <p>删除本模板后无法恢复，确认删除吗？</p>
                    <div class="subBtn">
                        <a-button @click="tempDelCancal">取消</a-button>
                        <a-button type="primary" @click="tempDelSure">确定</a-button>
                    </div>
                </a-modal>
        </a-card>
    </div>
</template>
<script>
import { PagedList, DeletePushMessageTemplate, CreatePushMessageTemplate } from '@/api/tk/templateManagement.js'
import tipMessage from '@/utils/messageUtil.js'

export default {
    name: 'TemplateManage',
    data() {
        return {
            form: {
                TemplateName: '',
                StartDate: null,
                EndDate: null
            },
            total: 0,
            QueryList: {
                PageNum: 1,
                PageSize: 20
            },
            columns: [
                {
                    title: '模板ID',
                    align: 'center',
                    scopedSlots: { customRender: 'Id' }
                },
                {
                    title: '创建时间',
                    align: 'center',
                    scopedSlots: { customRender: 'CTime' }
                },
                {
                    title: '模板名称',
                    align: 'center',
                    scopedSlots: { customRender: 'TemplateName' }
                },
                {
                    title: '内容概览',
                    align: 'center',
                    scopedSlots: { customRender: 'TemplateContentStr' }
                },
                {
                    title: '备注',
                    align: 'center',
                    scopedSlots: { customRender: 'TemplateRemark' }
                },
                {
                    title: '操作',
                    align: 'center',
                    scopedSlots: { customRender: 'GroupName' }
                },
            ],
            tempLoading: false,
            TemplateData: [],
            tempVisible: false,
            delId: null,
        }
    },
    created() {
        this.getTemplateList()
    },
    methods: {
        handleSearch() {
            this.getTemplateList()
        },
        // get list
        getTemplateList() {
            // const params = Object.assign({}, this.queryList, this.form)
            this.tempLoading = true
            const params = {...this.QueryList, ...this.form, ...{TemplateType: -1}}
            params.StartDate = params.StartDate ? new Date(+new Date(params.StartDate)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'') : null
            params.EndDate = params.EndDate ? new Date(+new Date(params.EndDate)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'') : null
            PagedList(params).then(res => {
                this.tempLoading = false
                this.TemplateData = res.Data
                this.total = res.TotalCount
                this.QueryList.PageNum = res.PageNum
                this.QueryList.PageSize = res.PageSize
            })
        },
        createdTemplate() {
            this.$router.push({name: 'AddEditTemplate', params: { pageStatusType: 1 }})
        },
        // 编辑
        clickSkipEdit(id, data) {
            this.$router.push({ name: 'AddEditTemplate', params: { id, data, pageStatusType: 2}})
        },
        // 删除
        clickDelete(Id){
            this.tempVisible = true
            this.delId = Id
        },
        tempDelSure() {
            DeletePushMessageTemplate({Id: this.delId}).then(res => {
                this.tempVisible = false
                this.getTemplateList()
                tipMessage.success('操作成功！')
            })
        },
        tempDelCancal() {
            this.tempVisible = false
        },
        hideModal() {
            this.tempVisible = false
        },
        // fen ye
        pageChange(p, s) {
            this.QueryList.PageNum = p
            this.getTemplateList()
        }
    }
}
</script>
<style lang="scss">
.template-box{
    .ant-card-head{
        font-size: 18px;
        font-weight: bold;
    }
    .ant-form label {
        font-size: 16px;
    }
    .ant-table {
        font-size: 16px !important;
    }
}

.dialog-temp{
    text-align: center;
    .ant-modal-header{
        border-bottom: 0;
        .ant-modal-title{
            font-size: 18px;
            font-weight: bold;
        }
    }
    .subBtn{
        width: 33%;
        margin: 30px auto 10px;
        display: flex;
        justify-content: space-between;
    }
}
</style>
<style lang="scss" scoped>
.template-box{
    .operate-dom{
        a{
            color: rgba(24, 144, 255, 1);
        }
        .temp-edit{
            margin-right: 16px;
        }
    }
    .page-box{
        text-align: center;
        .ant-pagination{
            font-size: 16px;
        }
    }
}
</style>