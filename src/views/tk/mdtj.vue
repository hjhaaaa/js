<template>
  <div>
    <a-card title="淘客免单数据" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="日期">
          <a-date-picker v-model="form.cDate"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 15px" type="primary" @click="daochu">导出</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="Id"
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
import { mgdaylxfeelist } from '@/api/auth.js'
export default {
  name: 'tk-mdtj',
  data(){
    return {
      form: {
        cDate: null,
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
          title: '新增人数',
          align: 'right',
          dataIndex: 'NewUCount',
        },
        {
          title: '今日新增代理浏览免单人数',
          align: 'right',
          dataIndex: 'MdNewULlCount',
        },
        {
          title: '非今日新增代理浏览免单人数(可领)',
          align: 'right',
          dataIndex: 'MdNewULlCount2',
        },
        {
          title: '非今日新增代理浏览免单人数(不可领)',
          align: 'right',
          dataIndex: 'MdNewULlCount3',
        },
        {
          title: '今日新增下免单人数',
          align: 'right',
          dataIndex: 'MdNewUXdCount',
        },
        {
          title: '非今日新增下免单人数',
          align: 'right',
          dataIndex: 'MdNewUXdCount2',
        },{
          title: '配置免单pid的淘客数量',
          align: 'right',
          dataIndex: 'OpenMdTkCount',
        },
      ],
      data: [],
      total: 0,
      tableLoading: false,
    }
  },
  methods: {
    query(){
      var params = Object.assign({},this.form,{
        cDate: this.form.cDate ? moment(this.form.cDate).format('YYYY-MM-DD') : ''
      })
      this.tableLoading = true
      mgdaylxfeelist(params).then(res => {
        this.data = res.PData
        this.total = res.TotalCount
        this.tableLoading = false
      }).catch(() => {this.tableLoading = false})
    },
    handleSearch(){
      this.form.page = 1
      this.query()
    },
    daochu(){
      let params = Object.assign({}, this.form,{
        cDate: this.form.cDate ? moment(this.form.cDate).format('YYYY-MM-DD') : ''
      })
      delete params.page
      delete params.pageSize
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }

      window.open('/api/d/fee/mgdaylxfeeexport?' + paramsArr.join('&'))
    },
    pageChange(p,s){
      this.form.page = p
      this.query()
    },
  },
  created(){
    this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
