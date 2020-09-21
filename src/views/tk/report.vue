<template>
  <div>
    <a-card title="淘客增长率报表" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="日期">
          <a-range-picker v-model="rangeDate"/>
        </a-form-item>
        <a-form-item label="日期">
          <a-range-picker v-model="rangeDate2"/>
        </a-form-item>
        <a-form-item label="淘客Id">
          <a-input v-model="form.TkId"/>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model="form.Email"/>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model="form.Nick"/>
        </a-form-item>
        <a-form-item label="群组">
          <a-select v-model="form.GroupId" style="width: 150px">
            <a-select-option value="-1">全部</a-select-option>
            <a-select-option v-for="(value, index) in groupList" :value="value.Id" :key="index">{{value.Name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="工作人员">
          <a-select v-model="form.HeadId" style="width: 150px">
            <a-select-option value="-1">全部</a-select-option>
            <a-select-option v-for="(value, index) in gzryList" :value="value.Id" :key="index">{{value.Name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="收入区间">
          <a-select v-model="form.RankType" style="width: 200px">
            <a-select-option value="-1">全部</a-select-option>
            <a-select-option v-for="(value, index) in srqjList" :value="value.Val" :key="index">{{value.Name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 15px" type="primary" icon="upload" @click="handleReport">导出</a-button>
          <!-- <a-button style="margin-left: 15px" type="primary" icon="cloud" @click="handleImport">导入</a-button> -->
          <a-upload
            name="file"
            :multiple="true"
            action="/api/d/tkheaddata/import"
            :headers="headers"
            :showUploadList="false"
            @change="handleChange"
          >
            <a-button style="margin-left: 15px" type="primary" icon="download">导入</a-button>
          </a-upload>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="data"
        :rowClassName="()=> 'row111'"
        :rowKey="rowKey"
        :loading="tableLoading"
        :pagination="false"
      >
        <span slot="name" slot-scope="row">
          <span v-if="row.RankTypeName" style="font-weight: bold">{{row.RankTypeName}}</span>
          <span v-else>{{row.TkId}}/{{row.Nick}}</span>
        </span>
        <span slot="Amount" slot-scope="row">{{_mformat(parseInt(row.Amount/100))}}</span>
        <span slot="Commission" slot-scope="row">{{_mformat(parseInt(row.Commission/100))}}</span>

        <!-- 六个增长率 -->
        <span slot="TbRate" slot-scope="row">
          <span v-if="row.TbRate">{{row.TbRate == '/' ? '/' : (row.TbRate + '%')}}</span>
        </span>
        <span slot="TbXdRate" slot-scope="row">
          <span v-if="row.TbXdRate">{{row.TbXdRate == '/' ? '/' : (row.TbXdRate + '%')}}</span>
        </span>
        <span slot="YjTbRate" slot-scope="row">
          <span v-if="row.YjTbRate">{{row.YjTbRate == '/' ? '/' : (row.YjTbRate + '%')}}</span>
        </span>
        <span slot="YjTbXdRate" slot-scope="row">
          <span v-if="row.YjTbXdRate">{{row.YjTbXdRate == '/' ? '/' : (row.YjTbXdRate + '%')}}</span>
        </span>
        <span slot="TdTbRate" slot-scope="row">
          <span v-if="row.TdTbRate">{{row.TdTbRate == '/' ? '/' : (row.TdTbRate + '%')}}</span>
        </span>
        <span slot="TdTbXdRate" slot-scope="row">
          <span v-if="row.TdTbXdRate">{{row.TdTbXdRate == '/' ? '/' : (row.TdTbXdRate + '%')}}</span>
        </span>
        <!-- end -->
      </a-table>
      <div style="margin-top: 15px">
        <a-pagination 
          size="small" 
          :pageSize.sync="form.PageSize" 
          v-model="form.Page"
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
import moment from 'moment'
import { tkReportList, getHeadList, getSrqjList, tkQpDaochu, grouplist, tkImport } from '@/api/auth.js'
export default {
  name: 'tk-report',
  data(){
    return {
      groupList: [],
      gzryList: [],
      srqjList: [],
      form: {
        SDate: "",
        EDate: "",
        SDate2: "",
        EDate2: "",
        TkId: "",
        Email: "",
        Nick: "",
        GroupId: "-1",
        HeadId: "-1",
        RankType: "-1",
        PageSize: 10,
        Page: 1
      },
      total: 0,
      tableLoading: false,
      rangeDate: [],
      rangeDate2: [],
      columns: [
        {
          title: '淘客Id/昵称',
          width: 180,
          align: 'center',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: 'GMV',
          align: 'right',
          scopedSlots: { customRender: 'Amount' },
        },
        {
          title: '总佣金',
          align: 'right',
          scopedSlots: { customRender: 'Commission' },
        },
        {
          title: '团队总数',
          align: 'right',
          dataIndex: 'UserCount',
        },
        {
          title: 'GMV同比增长率',
          align: 'right',
          scopedSlots: { customRender: 'TbRate' },
        },
        {
          title: 'GMV相对增长率',
          align: 'right',
          scopedSlots: { customRender: 'TbXdRate' },
        },
        {
          title: '佣金同比增长率',
          align: 'right',
          scopedSlots: { customRender: 'YjTbRate' },
        },
        {
          title: '佣金相对增长率',
          align: 'right',
          scopedSlots: { customRender: 'YjTbXdRate' },
        },
        // {
        //   title: '团队同比',
        //   align: 'right',
        //   scopedSlots: { customRender: 'TdTbRate' },
        // },
        // {
        //   title: '相对增长率',
        //   align: 'right',
        //   scopedSlots: { customRender: 'TdTbXdRate' },
        // },
        {
          title: '所属编辑',
          align: 'center',
          dataIndex: 'HeadName',
        },
        {
          title: '群组',
          align: 'center',
          dataIndex: 'GroupName',
        }
      ],
      data: [],
      selectedRowKeys: [],
      headers: {
        authorization: 'authorization-text',
      },
    }
  },
  methods: {
    getGroup(){
      grouplist().then(res => {
        this.groupList = res
      })
    },
    getGongZuoRenYuan(){
      getHeadList().then(res => {
        this.gzryList = res
      })
    },
    getShouRuQuJian(){
      getSrqjList().then(res => {
        this.srqjList = res
      })
    },
    query(){
      this.tableLoading = true
      if(this.rangeDate.length == 2){
        this.form.SDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.EDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }
      if(this.rangeDate2.length == 2){
        this.form.SDate2 = moment(this.rangeDate2[0]).format('YYYY-MM-DD')
        this.form.EDate2 = moment(this.rangeDate2[1]).format('YYYY-MM-DD')
      }
      
      tkReportList(this.form).then(res => {
        this.data = res.RankList.concat(res.PageList.PData)
        this.total = res.PageList.TotalCount
        this.tableLoading = false
      }).catch(() => {this.tableLoading = false})
    },
    handleSearch(){
      this.form.Page = 1
      this.query()
    },
    pageChange(p,s){
      this.form.Page = p
      this.query()
    },
    onShowSizeChange(p,s){
      this.form.PageSize = s
      this.query()
    },
    rowKey(record){
      if(record.RankType){
        return record.RankType
      }else{
        return record.TkId
      }
    },
    handleReport(){
      if(this.rangeDate.length == 2){
        this.form.SDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.EDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }
      if(this.rangeDate2.length == 2){
        this.form.SDate2 = moment(this.rangeDate2[0]).format('YYYY-MM-DD')
        this.form.EDate2 = moment(this.rangeDate2[1]).format('YYYY-MM-DD')
      }
      console.log(this.form)
      let params = Object.assign({}, this.form)
      delete params.Page
      delete params.PageSize
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }
      window.open('/api/d/tkheaddata/tkdatareportexport?' + paramsArr.join('&'))
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if(info.file.response.code == 0){
          this.$message.success('导入成功')
        }else{
          this.$message.error(info.file.response.msg);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 导入失败`);
      }
    }
  },
  created(){
    this.getGroup()
    this.getGongZuoRenYuan()
    this.getShouRuQuJian()
    // this.query()
  }
}
</script>

<style lang="scss" scoped>

</style>
