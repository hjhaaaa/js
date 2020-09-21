<template>
  <div class="tk-data">
    <a-card title="淘客全盘数据" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 15px" type="primary" icon="upload" @click="handleReport">导出</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="CDate"
        :loading="tableLoading"
        :pagination="false"
      >
        <span slot="date" slot-scope="row">{{row.CDate && row.CDate.slice(0,10)}}</span>

        <span slot="TdCommission" slot-scope="row">{{_mformat(parseInt(row.TdCommission/100))}}</span>
        <span slot="TdAppKeyCommission" slot-scope="row">{{_mformat(parseInt(row.TdAppKeyCommission/100))}}</span>
        <span slot="TdGmv" slot-scope="row">{{_mformat(parseInt(row.TdGmv/100))}}</span>
        <span slot="TdAppKeyGmv" slot-scope="row">{{_mformat(parseInt(row.TdAppKeyGmv/100))}}</span>

      </a-table>
      <div style="margin-top: 15px">
        <a-pagination 
          size="small" 
          :pageSize.sync="form.pagesize" 
          v-model="form.page"
          @change="pageChange"
          :total="total" 
          @showSizeChange="onShowSizeChange"
          showSizeChanger 
          showQuickJumper 
          :showTotal="total => `共${total}条`"
        />
      </div>
    </a-card>
  </div>
</template>

<script>
import { tkqpmonthlist } from '@/api/auth.js'
export default {
  name: 'tk-dataMon',
  data(){
    return {
      form: {
        pagesize: 10,
        page: 1
      },
      total: 0,
      tableLoading: false,
      columns: [
        {
          title: '日期',
          width: 70,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '总订单数',
          align: 'right',
          dataIndex: 'TdOrderCount',
        },
        {
          title: '总订单数(key)',
          align: 'right',
          dataIndex: 'TdAppKeyOrderCount',
        },
        {
          title: '淘客自购订单',
          width: 120,
          align: 'right',
          dataIndex: 'TkOrderCount',
        },
        {
          title: '淘客自购订单(key)',
          width: 150,
          align: 'right',
          dataIndex: 'TkAppKeyOrderCount',
        },
        {
          title: '代理订单',
          align: 'right',
          dataIndex: 'UOrderCount',
        },
        {
          title: '代理订单(key)',
          width: 140,
          align: 'right',
          dataIndex: 'UAppKeyOrderCount',
        },
        
        {
          title: '总佣金',
          width: 70,
          align: 'right',
          key: 'TdCommission',
          scopedSlots: { customRender: 'TdCommission' },
        },
        {
          title: '总佣金(key)',
          align: 'right',
          key: 'TdAppKeyCommission',
          scopedSlots: { customRender: 'TdAppKeyCommission' },
        },
        {
          title: '总GMV',
          align: 'right',
          defaultSortOrder: 'ascend',
          key: 'TdGmv',
          scopedSlots: { customRender: 'TdGmv' },
        },
        {
          title: '总GMV(key)',
          align: 'right',
          key: 'TdAppKeyGmv',
          scopedSlots: { customRender: 'TdAppKeyGmv' },
        },
        {
          title: '团队总人数',
          align: 'right',
          dataIndex: 'UCount',
        },
        {
          title: '新增人数',
          align: 'right',
          dataIndex: 'NewUCount',
        },
        {
          title: '淘客拉新人数',
          width: 80,
          align: 'right',
          dataIndex: 'NewTkLx',
        },
        {
          title: '用户拉新人数',
          width: 80,
          align: 'right',
          dataIndex: 'NewULx',
        },
      ],
      data: [],
    }
  },
  methods: {
    query(){
      this.tableLoading = true
      tkqpmonthlist(this.form).then(res => {
        this.data = res.PData
        this.total = res.TotalCount
        this.tableLoading = false
      })
    },
    handleSearch(){
      this.form.page = 1
      this.query()
    },
    handleReport(){
      window.open('/api/d/tkheaddata/tkqpmonthlistexport')
    },
    pageChange(p,s){
      this.form.page = p
      this.query()
    },
    onShowSizeChange(p,s){
      this.form.pagesize = s
      this.query()
    },
  },
  created(){
    this.query()
  }
}
</script>

<style lang="scss">
  .tk-data{
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 5px 0;
    }
  }
</style>
