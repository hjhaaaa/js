<template>
  <div>
    <a-card title="群组管理" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 15px" type="primary" @click="addGroup">新增</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="data"
        :rowClassName="()=> 'row111'"
        rowKey="Id"
        :loading="tableLoading"
        :pagination="true"
        style="width: 600px"
      >
        <div slot="caozuo" slot-scope="row">
          <a @click="editGroup(row)" href="javascript:0;">修改</a>
        </div>
      </a-table>
    </a-card>
    <a-modal
      :title="gTitle"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="群组名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="form.Name"/>
        </a-form-item>
        <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="form.Remark"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { grouplist, editgroup } from '@/api/auth.js'
export default {
  name: 'tk-report',
  data(){
    return {
      gzryList: [],
      gTitle: '新增群组',
      visible: false,
      form: {
        Name: '',
        Remark: ''
      },
      total: 0,
      tableLoading: false,
      rangeDate: [],
      rangeDate2: [],
      columns: [
        {
          title: 'Id',
          width: 180,
          dataIndex: 'Id',
        },
        {
          title: '群组名称',
          dataIndex: 'Name',
        },
        {
          title: '备注',
          dataIndex: 'Remark',
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'caozuo' },
        }
      ],
      data: [],
      selectedRowKeys: []
    }
  },
  methods: {
    query(){
      this.tableLoading = true
      grouplist().then(res => {
        this.data = res
        this.total = res.length
        this.tableLoading = false
      }).catch(() => {this.tableLoading = false})
    },
    handleSearch(){
      this.query()
    },
    addGroup(){
      this.form = {
        Name: '',
        Remark: ''
      }
      this.gTitle = '新增群组'
      this.visible = true
      
    },
    editGroup(row){
      this.form = row
      this.gTitle = '修改群组'
      this.visible = true
    },
    handleOk(){
      editgroup(this.form).then(res => {
        this.visible = false
        this.query()
        if(this.gTitle == '新增群组'){
          this.$message.success('新增成功')
        }else{
          this.$message.success('修改成功')
        }
      })
    },
    handleCancel(){
      this.visible = false
    },
  },
  created(){
    this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
