<template>
  <div>
    <a-card title="美逛CPS数据" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="日期">
          <a-range-picker v-model="rangeDate"/>
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-model="form.Type" style="width: 150px">
            <a-select-option v-for="(value, index) in typelist" :value="value.CpsType" :key="index">{{value.CpsName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 15px" type="primary" @click="daochu">导出</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="OD"
        :loading="tableLoading"
        :pagination="false"
      >
        <span slot="OD" slot-scope="row">{{row.OD ? row.OD.slice(0, 10) : ''}}</span>
        <span slot="SG" slot-scope="row">{{_mformat(row.SG/100)}}</span>
        <span slot="SC" slot-scope="row">{{_mformat(row.SC/100)}}</span>
      </a-table>
      <div style="margin-top: 15px">
        <a-pagination 
          size="small" 
          :pageSize.sync="form.PageSize" 
          v-model="form.Page"
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
import { mgCpsList, cpsdropdownlist } from '@/api/auth.js'
export default {
  name: 'tk-cps',
  data(){
    return {
      form: {
        SDate: '',
        EDate: '',
        Type: 1,
        PageSize: 20,
        Page: 1,
      },
      rangeDate: [moment().startOf('month'),moment()],
      columns: [
        {
          title: '日期',
          width: 120,
          key: 'OD',
          scopedSlots: { customRender: 'OD' },
        },
        {
          title: '订单数',
          align: 'right',
          dataIndex: 'OC',
        },
        {
          title: '总出单用户',
          align: 'right',
          dataIndex: 'UC',
        },
        {
          title: '总GMV',
          align: 'right',
          key: 'SG',
          scopedSlots: { customRender: 'SG' },
        },
        {
          title: '总佣金',
          align: 'right',
          key: 'SC',
          scopedSlots: { customRender: 'SC' },
        },
      ],
      data: [],
      total: 0,
      tableLoading: false,
      typelist: []
    }
  },
  methods: {
    getTypeList(){
      cpsdropdownlist().then(res => {
        this.typelist = res
        this.form.Type = res[0].CpsType
        this.query()
      })
    },
    query(){
      console.log(this.rangeDate)
      if(this.rangeDate.length == 2){
        this.form.SDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.EDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }else{
        this.$message.error('请选择日期')
        return
      }
      this.tableLoading = true
      mgCpsList(this.form).then(res => {
        this.data = res.PData
        this.total = res.TotalCount
        this.tableLoading = false
      }).catch(() => {this.tableLoading = false})
    },
    handleSearch(){
      this.form.Page = 1
      this.query()
    },
    daochu(){
      if(this.rangeDate.length == 2){
        this.form.SDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.EDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }else{
        this.$message.error('请选择日期')
        return
      }
      let params = Object.assign({}, this.form)
      delete params.Page
      delete params.PageSize
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }

      window.open('/api/d/cps/listexport?' + paramsArr.join('&'))
    },
    pageChange(p,s){
      this.form.Page = p
      this.query()
    },
  },
  created(){
    this.getTypeList()
    // this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
