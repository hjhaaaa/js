<template>
  <div class="tk-data">
    <a-card title="淘客全盘数据" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="日期">
          <a-range-picker v-model="rangeDate"/>
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
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button type="primary" @click="zhipai" style="margin-left: 8px;width:82px;">指派给</a-button>
          <a-button style="margin-left: 8px" type="primary" icon="upload" @click="handleReport">导出</a-button>
          <a-button style="margin-left: 8px" type="primary" @click="visible1 = !visible1">表头选择</a-button>
        </a-form-item>
      </a-form>
      <div class="table-h-s" :class="visible1 ? 'hover' : ''">
        <a-checkbox-group v-model="selectcol" @change="onChangeGroup">
          <a-checkbox 
            style="width: 148px;margin-left: 0" 
            v-for="(value, index) in columns" 
            :key="index" 
            :disabled="value.title == '总GMV' || value.title == '操作'"
            @change="onChangeCheck($event, value, index)" 
            :value="value.title">{{value.title}}</a-checkbox>
        </a-checkbox-group>
      </div>
      <div style="">
        <a-table
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, fixed: true, columnWidth: 20}"
          :columns="usecolumns"
          :dataSource="data"
          rowKey="TkId"
          :loading="tableLoading"
          :pagination="false"
          @change="tableChange"
          :scroll="{ x: scrollX, y: 500 }"
        >
          <template slot="name" slot-scope="row">
            <div>{{row.Nick}}</div>
            <div>Id:{{row.TkId}}</div>
            <div>{{row.Mobile}}</div>
          </template>
          <span slot="SUMTdCommission" slot-scope="row">{{_mformat(parseInt(row.SUMTdCommission/100))}}</span>
          <span slot="SUMTdAppKeyCommission" slot-scope="row">{{_mformat(parseInt(row.SUMTdAppKeyCommission/100))}}</span>
          <span slot="SUMTdGmv" slot-scope="row">{{_mformat(parseInt(row.SUMTdGmv/100))}}</span>
          <span slot="SUMTdAppKeyGmv" slot-scope="row">{{_mformat(parseInt(row.SUMTdAppKeyGmv/100))}}</span>

          <span slot="IsPx" slot-scope="row">{{row.IsPx == 1 ? '是' : '否'}}</span>

          <template slot="Remark" slot-scope="row">
            <editable-cell :text="row.Remark" @change="onCellChange(row, $event)" />
          </template>
          <div slot="caozuo" slot-scope="row">
            <a @click="onDetail(row)" href="javascript:0;">详情</a>
          </div>
        </a-table>
      </div>
      
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
    <a-modal
      title="选择人员"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width="300px"
    >
      <a-select v-model="HeadId" style="width: 150px" placeholder="请选择">
        <a-select-option v-for="(value, index) in gzryList" :value="value.Id" :key="index">{{value.Name}}</a-select-option>
      </a-select>
    </a-modal>
    <!-- <a-modal
      title="表头选择"
      :visible="visible1"
      @ok="handleOk1"
      @cancel="handleCancel1"
      width="500px"
    >
      <a-checkbox-group @change="onChangeGroup">
        <a-checkbox 
          style="width: 148px;margin-left: 0" 
          v-for="(value, index) in columns" 
          :key="index" 
          @change="onChangeCheck($event, value, index)" 
          :value="value.title">{{value.title}}</a-checkbox>
      </a-checkbox-group>
    </a-modal> -->
  </div>
</template>

<script>
import moment from 'moment'
import { tkQuanpanList, tkQpEditremark, getHeadList, tkQpZhipai, grouplist } from '@/api/auth.js'
import EditableCell from './EditableCell.vue';
export default {
  components: {
    EditableCell,
  },
  name: 'tk-data',
  data(){
    return {
      groupList: [],
      gzryList: [],
      visible: false,
      visible1: false,
      confirmLoading: false,
      form: {
        SDate: "",
        EDate: "",
        TkId: "",
        Email: "",
        Nick: "",
        GroupId: "-1",
        PageSize: 10,
        Page: 1,
        Sort: 11
      },
      total: 0,
      tableLoading: false,
      HeadId: '',
      rangeDate: [moment().startOf('month'),moment()],
      columns: [
        {
          title: '昵称/淘客Id/手机',
          width: 80,
          align: 'right',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '总订单',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMTdOrderCount',
        },
        {
          title: '总订单(key)',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMTdAppKeyOrderCount',
        },
        {
          title: '淘客订单',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMTkOrderCount',
        },
        {
          title: '淘客订单(key)',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMTkAppKeyOrderCount',
        },
        {
          title: '代理订单',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMUOrderCount',
        },
        {
          title: '代理订单(key)',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMUAppKeyOrderCount',
        },
        {
          title: '总佣金',
          width: 86,
          align: 'right',
          sorter: true,
          key: 'SUMTdCommission',
          scopedSlots: { customRender: 'SUMTdCommission' },
        },
        {
          title: '总佣金(key)',
          width: 86,
          align: 'right',
          sorter: true,
          key: 'SUMTdAppKeyCommission',
          scopedSlots: { customRender: 'SUMTdAppKeyCommission' },
        },
        {
          title: '总GMV',
          width: 86,
          align: 'right',
          sorter: true,
          defaultSortOrder: 'ascend',
          key: 'SUMTdGmv',
          scopedSlots: { customRender: 'SUMTdGmv' },
        },
        {
          title: '总GMV(key)',
          width: 86,
          align: 'right',
          sorter: true,
          key: 'SUMTdAppKeyGmv',
          scopedSlots: { customRender: 'SUMTdAppKeyGmv' },
        },
        {
          title: '团队总人数',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMUCount',
        },
        {
          title: '拉新人数',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMNewUCount',
        },
        {
          title: '淘客拉新',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMNewTkLx',
        },
        {
          title: '用户拉新',
          width: 60,
          align: 'right',
          sorter: true,
          dataIndex: 'SUMNewULx',
        },
        {
          title: '培训',
          width: 46,
          sorter: true,
          align: 'center',
          scopedSlots: { customRender: 'IsPx' },
        },
        {
          title: 'key佣金上月排名',
          width: 60,
          align: 'right',
          dataIndex: 'LastRank',
        },
        {
          title: 'key佣金本月排名',
          width: 60,
          align: 'right',
          dataIndex: 'ThisRank',
        },

        {
          title: 'key_gmv上月排名',
          width: 60,
          align: 'right',
          dataIndex: 'LastRank_KeyGmv',
        },
        {
          title: 'key_gmv本月排名',
          width: 60,
          align: 'right',
          dataIndex: 'ThisRank_KeyGmv',
        },

        {
          title: 'key_gmv占比',
          width: 60,
          align: 'right',
          dataIndex: 'AppKeyGmvRate',
        },
      ],
      data: [],
      selectedRowKeys: [],
      usecolumns: [],
      selectcol: [],
      scrollX: 1470
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
    query(){
      this.tableLoading = true
      if(this.rangeDate.length == 2){
        this.form.SDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.EDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }
      
      tkQuanpanList(this.form).then(res => {
        this.data = res.PData
        this.total = res.TotalCount
        this.tableLoading = false
      })
    },
    handleSearch(){
      this.form.Page = 1
      this.query()
    },
    handleReport(){
      if(this.rangeDate.length == 2){
        this.form.SDate = moment(this.rangeDate[0]).format('YYYY-MM-DD')
        this.form.EDate = moment(this.rangeDate[1]).format('YYYY-MM-DD')
      }
      let params = Object.assign({}, this.form)
      delete params.Page
      delete params.PageSize
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }
      window.open('/api/d/tkheaddata/tkqplistexport?' + paramsArr.join('&'))
    },
    pageChange(p,s){
      this.form.Page = p
      this.query()
    },
    onShowSizeChange(p,s){
      this.form.PageSize = s
      this.query()
    },
    onCellChange(row, value) {
      if(row.Remark != value){
        tkQpEditremark({
          tkId: row.TkId,
          remark: value
        }).then(res => {
          this.$message.success('修改成功')
        })
      }else{
        this.$message.success('未修改')
      }
      row.Remark = value
    },
    zhipai(){
      if(this.selectedRowKeys.length > 0){
        this.visible = true
      }else{
        this.$message.success('至少选择一项')
      }
    },
    handleOk(){
      this.confirmLoading = true
      tkQpZhipai({
        tkIdList: this.selectedRowKeys,
        headId: this.HeadId
      }).then(res => {
        this.visible = false
        this.confirmLoading = false
        this.$message.success('指派成功')
      }).catch(() => {this.confirmLoading = false})
    },
    handleCancel(){
      this.visible = false
    },
    handleOk1(){

    },
    handleCancel1(){
      this.visible1 = false
    },
    onDetail(row){
      this.$router.push({path: '/tk/dataDetail',query: {
        id: row.TkId
      }})
    },
    onSelectChange(a){
      this.selectedRowKeys = a;
    },
    tableChange(p,f,s){
      this.form.Page = 1
      let keyArr = [
        'TkId',
        'SUMTdOrderCount',
        'SUMTdAppKeyOrderCount',
        'SUMTkOrderCount',
        'SUMTkAppKeyOrderCount',
        'SUMUOrderCount',
        'SUMUAppKeyOrderCount',
        'SUMTdCommission',
        'SUMTdAppKeyCommission',
        'SUMTdGmv',
        'SUMTdAppKeyGmv',
        'SUMUCount',
        'SUMNewUCount',
        'SUMNewTkLx',
        'SUMNewULx',
        'IsPx',
      ]
      let sortArr = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]

      if(s.order == 'ascend'){// 正序 负数
        keyArr.forEach((value, index) => {
          if(s.columnKey == value){
            this.form.Sort = sortArr[index]
          }
        })
      }else if(s.order == 'descend'){// 倒序 正数
        keyArr.forEach((value, index) => {
          if(s.columnKey == value){
            this.form.Sort = - sortArr[index]
          }
        })
      }else{
        this.form.Sort = 0
      }
      this.query()
    },
    getTableUse(){
      let _width = 20
      this.usecolumns = []
      this.columns.forEach((value, index) => {
        if(!value.noShow){
          _width += (value.width || 0)
          this.usecolumns.push(value)
        }
      })
      console.log('width: ', _width + 40)
      this.scrollX = _width + 40
    },
    onChangeGroup(checkedValues){
      
    },
    onChangeCheck(e, v, i){
      v.noShow = !e.target.checked
      localStorage.setItem('selectcol', JSON.stringify(this.columns))
      this.getTableUse()
    },
    getCookie(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    },

  },
  created(){
    this.getGroup()
    this.getGongZuoRenYuan()
    this.query()

    let _name = this.getCookie('_tkdataadmin_nick')
    if(
      _name != 'admin' 
      && _name != 'xiaomeng' 
      && _name != 'guobinbin'
    ){
      this.columns.push({
        title: '操作',
        // width: 40,
        align: 'center',
        scopedSlots: { customRender: 'caozuo' },
      })
    }else{
      this.columns.push({
        title: '备注',
        width: 160,
        align: 'center',
        scopedSlots: { customRender: 'Remark' },
      })
      this.columns.push({
        title: '操作',
        // width: 40,
        align: 'center',
        scopedSlots: { customRender: 'caozuo' },
      })
    }

    let c_selectcol = localStorage.getItem('selectcol')
    if(c_selectcol){
      this.columns = JSON.parse(c_selectcol)
    }else{
      localStorage.setItem('selectcol', JSON.stringify(this.columns))
    }

    this.columns.forEach((value, index) => {
      if(!value.noShow){
        this.selectcol.push(value.title)
      }
    })
  
    this.getTableUse()
  }
}
</script>

<style lang="scss">
  .tk-data{
    .table-h-s{
      height: 0;
      transition: all .5s;
      overflow: hidden;
    }
    .table-h-s.hover{
      height: 84px;
    }

    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 5px 0;
    }
  }
  
</style>
