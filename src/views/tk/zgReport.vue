<template>
  <div>
    <a-card :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="年份">
          <a-input v-model="form.year"/>
        </a-form-item>
        <a-form-item label="自购订单数≥">
          <a-input v-model="form.oc"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 15px" type="primary" icon="upload" @click="handleReport">导出</a-button>
        </a-form-item>
      </a-form>
      <div style="margin-top: 50px;width: 800px">
        <ve-histogram :data="chartData"></ve-histogram>
      </div>

      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        rowKey="Month"
        style="width: 800px"
      >
        <span slot="date" slot-scope="row">{{row.Month}}月</span>
        <span slot="OrderAmount" slot-scope="row">{{_mformat(parseInt(row.OrderAmount/100))}}</span>
        <span slot="Commission" slot-scope="row">{{_mformat(parseInt(row.Commission/100))}}</span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { mgzgmonthinfo } from '@/api/auth.js'
export default {
  name: 'tk-dataDetail',
  data(){
    return {
      form: {
        year: '',
        oc: 3
      },
      columns: [
        {
          title: '日期',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: '代理人数',
          align: 'right',
          dataIndex: 'UCount',
        },
        {
          title: '代理人数占比',
          align: 'right',
          dataIndex: 'Zb',
        }
      ],
      data: [],
      chartData: {
        columns: ['月份', '代理人数'],
        rows: []
      }
    }
  },
  methods: {
    query(){
      if(!this.form.year){
        this.$message.info('请输入年份')
        return
      }
      if(!this.form.oc){
        this.$message.info('请输入自购订单数')
        return
      }
      mgzgmonthinfo(this.form).then(res => {
        this.data = res
        this.chartData.rows = []
        res.forEach((value, index) => {
          this.chartData.rows.push({
            '月份': value.Month + '月',
            '代理人数': value.UCount
          })
        })
      })
    },
    handleSearch(){
      this.query()
    },
    handleReport(){
      let params = Object.assign({}, this.form)
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }
      console.log('/api/d/mgdayzg/mgzgmonthinfoexport?' + paramsArr.join('&'))
      window.open('/api/d/mgdayzg/mgzgmonthinfoexport?' + paramsArr.join('&'))
    }
  },
  created(){
    // this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
