<template>
  <div>
    <a-card title="美逛自购数据列表" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="日期">
          <a-range-picker v-model="rangeDate"/>
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
        @change="tableChange"
      >
        <span slot="CDate" slot-scope="row">{{row.CDate ? row.CDate.slice(0, 10) : ''}}</span>
        <span slot="ZGL" slot-scope="row">{{row.ZGL/100}}%</span>
        <span slot="NewZGL" slot-scope="row">{{row.NewZGL/100}}%</span>
        <span slot="SDUZb" slot-scope="row">{{row.SDUZb/100}}%</span>
        <span slot="SDUGmv" slot-scope="row">{{parseInt(row.SDUGmv/100)}}</span>
        <span slot="OldUGmv" slot-scope="row">{{parseInt(row.OldUGmv/100)}}</span>
        <span slot="GMV" slot-scope="row">{{parseInt(row.GMV/100)}}</span>
        <span slot="ShakeFeedUV/ShakeFeedPV"  slot-scope="row">{{row.ShakeFeedUV}}/{{row.ShakeFeedPV}}</span>
        <span slot="ShakeUV/ShakePV"  slot-scope="row">{{row.ShakeUV}}/{{row.ShakePV}}</span>
        <span slot="XsqgUserCount" slot-scope="row">{{row.XsqgUserCount}}</span>
        <span slot="XsqgClickCount" slot-scope="row">{{row.XsqgClickCount}}</span>
        <template slot="Remark" slot-scope="row">
          <editable-cell :text="row.Remark" @change="onCellChange(row, $event)" />
        </template>
        <div slot="caozuo" slot-scope="row">
          <a @click="editGroup(row)" href="javascript:0;">修改</a>
        </div>
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
import { mgdayzglist, zgEditRemark } from '@/api/auth.js'
import EditableCell from './EditableCell.vue';
export default {
  name: 'tk-zigou',
  components: { EditableCell },
  data(){
    return {
      form: {
        sDate: '',
        eDate: '',
        sort: 0,
        pageSize: 20,
        page: 1,
      },
      rangeDate: [],
      columns: [
        {
          title: '日期',
          width: 120,
          sorter: true,
          key: 'CDate',
          scopedSlots: { customRender: 'CDate' },
        },
        {
          title: '总代理人数',
          align: 'right',
          dataIndex: 'UCount',
        },
        {
          title: '自购人数',
          align: 'right',
          sorter: true,
          dataIndex: 'ZGUCount',
        },
        {
          title: '自购率',
          align: 'right',
          sorter: true,
          key: 'ZGL',
          scopedSlots: { customRender: 'ZGL' },
        },
        {
          title: '新增代理人数',
          align: 'right',
          sorter: true,
          dataIndex: 'NewUCount',
        },
        {
          title: '新增代理自购人数',
          align: 'right',
          sorter: true,
          dataIndex: 'NewUZGCount',
        },
        {
          title: '新增代理自购率',
          align: 'right',
          sorter: true,
          key: 'NewZGL',
          scopedSlots: { customRender: 'NewZGL' },
        },
        {
          title: '首单用户数',
          align: 'right',
          sorter: true,
          dataIndex: 'SDUCount',
        },
        {
          title: '首单用户占比',
          align: 'right',
          sorter: true,
          key: 'SDUZb',
          scopedSlots: { customRender: 'SDUZb' },
        },
        {
          title: '首单用户GMV',
          align: 'right',
          sorter: true,
          key: 'SDUGmv',
          scopedSlots: { customRender: 'SDUGmv' },
        },
        {
          title: '老用户GMV',
          align: 'right',
          sorter: true,
          key: 'OldUGmv',
          scopedSlots: { customRender: 'OldUGmv' },
        },
        {
          title: '总GMV',
          align: 'right',
          sorter: true,
          key: 'GMV',
          scopedSlots: { customRender: 'GMV' },
        },
        {
          title: '抖货广场UV/PV',
          align: 'right',
          sorter: true,
          key: 'ShakeFeedUV/ShakeFeedPV',
          scopedSlots: { customRender: 'ShakeFeedUV/ShakeFeedPV' },
        },
        {
          title: '抖货UV/PV',
          align: 'right',
          sorter: true,
          key: 'ShakeUV/ShakePV',
          scopedSlots: { customRender: 'ShakeUV/ShakePV' },
        },
        {
          title: '新人模块人数',
          align: 'right',
          sorter: true,
          key: 'XsqgUserCount',
          scopedSlots: { customRender: 'XsqgUserCount' },
        },
        {
          title: '新人模块点击量',
          align: 'right',
          sorter: true,
          key: 'XsqgClickCount',
          scopedSlots: { customRender: 'XsqgClickCount' },
        },
        {
          title: '自购总订单数',
          align: 'right',
          sorter: true,
          dataIndex: 'ZGOrderCount',
        },
        {
          title: '备注',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'Remark' },
        },
      ],
      data: [],
      total: 0,
      tableLoading: false
    }
  },
  methods: {
    query(){
      this.tableLoading = true
      if(this.rangeDate.length == 2){
        this.form.sDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.eDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }
      mgdayzglist(this.form).then(res => {
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
      if(this.rangeDate.length == 2){
        this.form.sDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.eDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }
      let params = Object.assign({}, this.form)
      delete params.page
      delete params.pageSize
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }
      console.log('/api/d/mgdayzg/mgdayzgexport?' + paramsArr.join('&'))
      window.open('/api/d/mgdayzg/mgdayzgexport?' + paramsArr.join('&'))
    },
    tableChange(p,f,s){
      this.form.page = 1
      if(s.order == 'ascend'){// 正序 负数
        if(s.columnKey == 'CDate'){
          this.form.sort = -1
        }
        if(s.columnKey == 'ZGUCount'){
          this.form.sort = -2
        }
        if(s.columnKey == 'ZGL'){
          this.form.sort = -3
        }
        if(s.columnKey == 'NewUCount'){
          this.form.sort = -4
        }
        if(s.columnKey == 'NewUZGCount'){
          this.form.sort = -5
        }
        if(s.columnKey == 'NewZGL'){
          this.form.sort = -6
        }
        if(s.columnKey == 'SDUCount'){
          this.form.sort = -7
        }
        if(s.columnKey == 'SDUZb'){
          this.form.sort = -8
        }
        if(s.columnKey == 'SDUGmv'){
          this.form.sort = -9
        }
        if(s.columnKey == 'OldUGmv'){
          this.form.sort = -10
        }
        if(s.columnKey == 'GMV'){
          this.form.sort = -11
        }
        if(s.columnKey == 'ZGOrderCount'){
          this.form.sort = -12
        }
      }else if(s.order == 'descend'){// 倒序 正数
        if(s.columnKey == 'CDate'){
          this.form.sort = 1
        }
        if(s.columnKey == 'ZGUCount'){
          this.form.sort = 2
        }
        if(s.columnKey == 'ZGL'){
          this.form.sort = 3
        }
        if(s.columnKey == 'NewUCount'){
          this.form.sort = 4
        }
        if(s.columnKey == 'NewUZGCount'){
          this.form.sort = 5
        }
        if(s.columnKey == 'NewZGL'){
          this.form.sort = 6
        }
        if(s.columnKey == 'SDUCount'){
          this.form.sort = 7
        }
        if(s.columnKey == 'SDUZb'){
          this.form.sort = 8
        }
        if(s.columnKey == 'SDUGmv'){
          this.form.sort = 9
        }
        if(s.columnKey == 'OldUGmv'){
          this.form.sort = 10
        }
        if(s.columnKey == 'GMV'){
          this.form.sort = 11
        }
        if(s.columnKey == 'ZGOrderCount'){
          this.form.sort = 12
        }
      }else{
        this.form.sort = 0
      }
      this.query()
    },
    pageChange(p,s){
      this.form.page = p
      this.query()
    },
    onCellChange(row, value) {
      if(row.Remark != value){
        zgEditRemark({
          Id: row.Id,
          Remark: value
        }).then(res => {
          this.$message.success('修改成功')
        })
      }else{
        this.$message.success('未修改')
      }
      row.Remark = value
    },
  },
  created(){
    this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 12px 3px;
  }
</style>
