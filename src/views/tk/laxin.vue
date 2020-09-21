<template>
  <div>
    <a-card title="美逛拉新数据列表" :bordered="false">
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
import { mgdaylxlist } from '@/api/auth.js'
export default {
  name: 'tk-laxin',
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
          title: '新增人数',
          align: 'right',
          sorter: true,
          dataIndex: 'NewUCount',
        },
        {
          title: '新增人数(淘客拉新)',
          align: 'right',
          sorter: true,
          dataIndex: 'NewUTkCount',
        },
        {
          title: '新增人数(代理拉新)',
          align: 'right',
          sorter: true,
          dataIndex: 'NewUFTkCount',
        },
        {
          title: '总人数',
          align: 'right',
          dataIndex: 'UCount',
        },
        {
          title: '成功拉新的代理人数',
          align: 'right',
          sorter: true,
          dataIndex: 'LxBefUCount',
        },
        {
          title: '打开App用户数',
          align: 'right',
          sorter: true,
          dataIndex: 'AppOpenUCount',
        },
        {
          title: '注销用户数',
          align: 'right',
          sorter: true,
          dataIndex: 'ZxUCount',
        },
        {
          title: '未登录app人数',
          align: 'right',
          sorter: true,
          dataIndex: 'NewUserNotLoginCount',
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
      mgdaylxlist(this.form).then(res => {
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
      console.log('/api/d/mgdaylx/mgdaylxexport?' + paramsArr.join('&'))
      window.open('/api/d/mgdaylx/mgdaylxexport?' + paramsArr.join('&'))
    },
    tableChange(p,f,s){
      this.form.page = 1
      if(s.order == 'ascend'){// 正序 负数
        if(s.columnKey == 'CDate'){
          this.form.sort = -1
        }
        if(s.columnKey == 'NewUCount'){
          this.form.sort = -2
        }
        if(s.columnKey == 'NewUFTkCount'){
          this.form.sort = -3
        }
        if(s.columnKey == 'NewUTkCount'){
          this.form.sort = -4
        }
        if(s.columnKey == 'LxBefUCount'){
          this.form.sort = -5
        }
        if(s.columnKey == 'AppOpenUCount'){
          this.form.sort = -6
        }
        if(s.columnKey == 'ZxUCount'){
          this.form.sort = -7
        }
      }else if(s.order == 'descend'){// 倒序 正数
        if(s.columnKey == 'CDate'){
          this.form.sort = 1
        }
        if(s.columnKey == 'NewUCount'){
          this.form.sort = 2
        }
        if(s.columnKey == 'NewUFTkCount'){
          this.form.sort = 3
        }
        if(s.columnKey == 'NewUTkCount'){
          this.form.sort = 4
        }
        if(s.columnKey == 'LxBefUCount'){
          this.form.sort = 5
        }
        if(s.columnKey == 'AppOpenUCount'){
          this.form.sort = 6
        }
        if(s.columnKey == 'ZxUCount'){
          this.form.sort = 7
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
  },
  created(){
    this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
