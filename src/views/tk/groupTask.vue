<template>
  <div>
    <a-card title="组团任务统计" :bordered="false">
      <a-form layout="inline" :form="form" style="margin-bottom: 10px">
        <a-form-item label="日期">
          <!-- <a-range-picker v-model="rangeDate"/> -->
          <a-month-picker v-model="form.time"/>
        </a-form-item>
        <a-form-item label="所属团">
          <a-select v-model="form.groupId" style="width: 150px">
            <a-select-option :value="1">KA</a-select-option>
            <a-select-option :value="2">普通团</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          <a-button type="primary" style="margin-left: 15px" @click="chongzhi">重置</a-button>
          <a-button style="margin-left: 15px" type="primary" @click="daochu">导出</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        size="middle"
        rowKey="Id"
        :loading="tableLoading"
        :pagination="false"
        :scroll="{ x: 1800 }"
      >
        <span slot="CDate" slot-scope="row">{{row.DataDate ? row.DataDate.slice(0, 10) : ''}}</span>
        <span slot="GroupId" slot-scope="row">{{row.GroupId == 1 ? 'KA' : '普通团'}}</span>

        <span slot="AliPayAmount_pre" slot-scope="row">{{row.AliPayAmount_pre / 10000}}</span>
        <span slot="AliPayAmount_pre_DayDelta" slot-scope="row">{{row.AliPayAmount_pre_DayDelta / 10000}}</span>
        <span slot="jindu1" slot-scope="row">
          初级：{{parseInt(row.AliPayAmount_pre / row.AliPayAmount_target1 * 100)}}%<br/>
          高级：{{parseInt(row.AliPayAmount_pre / row.AliPayAmount_target2 * 100)}}%
        </span>
        <span slot="mubiao1" slot-scope="row">
          初级：{{row.AliPayAmount_target1 / 10000}}<br/>
          高级：{{row.AliPayAmount_target2 / 10000}}
        </span>

        <span slot="BuyRidCount_pre" slot-scope="row">{{row.BuyRidCount_pre}}</span>
        <span slot="BuyRidCount_pre_DayDelta" slot-scope="row">{{row.BuyRidCount_pre_DayDelta}}</span>
        <span slot="jindu2" slot-scope="row">
          初级：{{parseInt(row.BuyRidCount_pre / row.BuyRidCount_target1 * 100)}}%<br/>
          高级：{{parseInt(row.BuyRidCount_pre / row.BuyRidCount_target2 * 100)}}%
        </span>
        <span slot="mubiao2" slot-scope="row">
          初级：{{row.BuyRidCount_target1}}<br/>
          高级：{{row.BuyRidCount_target2}}
        </span>

        <span slot="HotItem_pre" slot-scope="row">{{row.HotItem_pre}}</span>
        <span slot="HotItem_pre_DayDelta" slot-scope="row">{{row.HotItem_pre_DayDelta}}</span>
        <span slot="jindu3" slot-scope="row">
          初级：{{parseInt(row.HotItem_pre / row.HotItem_target1 * 100)}}%<br/>
          高级：{{parseInt(row.HotItem_pre / row.HotItem_target2 * 100)}}%
        </span>
        <span slot="mubiao3" slot-scope="row">
          初级：{{row.HotItem_target1}}<br/>
          高级：{{row.HotItem_target2}}
        </span>

        <span slot="DiffItem_PayAmount_scale_pre" slot-scope="row">{{row.DiffItem_PayAmount_scale_pre / 10000}}</span>
        <span slot="DiffItem_PayAmount_scale_pre_DayDelta" slot-scope="row">{{row.DiffItem_PayAmount_scale_pre_DayDelta / 10000}}</span>
        <span slot="jindu4" slot-scope="row">
          初级：{{parseInt(row.DiffItem_PayAmount_scale_pre / (row.DiffItem_target1 * 10000) * 100)}}%<br/>
          中级：{{parseInt(row.DiffItem_PayAmount_scale_pre / (row.DiffItem_target2 * 10000) * 100)}}%<br/>
          高级：{{parseInt(row.DiffItem_PayAmount_scale_pre / (row.DiffItem_target3 * 10000) * 100)}}%
        </span>
        <span slot="mubiao4" slot-scope="row">
          初级：{{row.DiffItem_target1}}<br/>
          中级：{{row.DiffItem_target2}}<br/>
          高级：{{row.DiffItem_target3}}
        </span>

        <span slot="LiveCount_cpaReward_pre" slot-scope="row">{{row.LiveCount_cpaReward_pre / 10000}}</span>
        <span slot="LiveCount_cpaReward_pre_DayDelta" slot-scope="row">{{row.LiveCount_cpaReward_pre_DayDelta / 10000}}</span>

        <!-- <div slot="caozuo" slot-scope="row">
          <a @click="editGroup(row)" href="javascript:0;">修改</a>
        </div> -->
      </a-table>
      <div style="margin-top: 15px">
        <!-- <a-pagination 
          size="small" 
          :pageSize.sync="form.pageSize" 
          v-model="form.page"
          @change="pageChange"
          :total="total" 
          showQuickJumper 
          :showTotal="total => `共${total}条`"
        /> -->
        共{{total}}条
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getcpadetail } from '@/api/auth.js'
export default {
  name: 'tk-laxin',
  data(){
    return {
      form: {
        time: null,
        groupId: '',
      },
      rangeDate: [],
      columns: [
        {
          title: '日期',
          align: 'center',
          width: 80,
          key: 'CDate',
          scopedSlots: { customRender: 'CDate' },
        },
        {
          title: '美逛更新时间',
          width: 80,
          align: 'center',
          dataIndex: 'UTime',
        },
        {
          title: '联盟更新时间',
          width: 80,
          align: 'center',
          dataIndex: 'DataTime',
        },
        {
          title: '所属团',
          align: 'center',
          key: 'GroupId',
          scopedSlots: { customRender: 'GroupId' },
        },
        {
          title: '月度GMV',
          children: [
            {
              title: '当前GMV',
              align: 'center',
              key: 'AliPayAmount_pre',
              scopedSlots: { customRender: 'AliPayAmount_pre' },
            },
            {
              title: '任务完成进度',
              align: 'center',
              width: 100,
              key: 'jindu1',
              scopedSlots: { customRender: 'jindu1' },
            },
            {
              title: '目标值',
              align: 'center',
              width: 120,
              key: 'mubiao1',
              scopedSlots: { customRender: 'mubiao1' },
            },
            {
              title: '今日成交GMV',
              align: 'center',
              key: 'AliPayAmount_pre_DayDelta',
              scopedSlots: { customRender: 'AliPayAmount_pre_DayDelta' },
            },
          ]
        },
        {
          title: '月度去重有成交用户数（非RID）',
          children: [
            {
              title: '当前用户数',
              align: 'center',
              key: 'BuyRidCount_pre',
              scopedSlots: { customRender: 'BuyRidCount_pre' },
            },
            {
              title: '任务完成度',
              align: 'center',
              width: 90,
              key: 'jindu2',
              scopedSlots: { customRender: 'jindu2' },
            },
            {
              title: '目标值',
              align: 'center',
              width: 100,
              key: 'mubiao2',
              scopedSlots: { customRender: 'mubiao2' },
            },
            {
              title: '今日成交用户数',
              align: 'center',
              key: 'BuyRidCount_pre_DayDelta',
              scopedSlots: { customRender: 'BuyRidCount_pre_DayDelta' },
            },
          ]
        },
        {
          title: '月成交爆品个数总和',
          children: [
            {
              title: '当前爆品数',
              align: 'center',
              key: 'HotItem_pre',
              scopedSlots: { customRender: 'HotItem_pre' },
            },
            {
              title: '任务完成进度',
              align: 'center',
              width: 80,
              key: 'jindu3',
              scopedSlots: { customRender: 'jindu3' },
            },
            {
              title: '目标值',
              align: 'center',
              width: 80,
              key: 'mubiao3',
              scopedSlots: { customRender: 'mubiao3' },
            },
            {
              title: '今日爆品个数',
              align: 'center',
              key: 'HotItem_pre_DayDelta',
              scopedSlots: { customRender: 'HotItem_pre_DayDelta' },
            },
          ]
        },
        {
          title: '指定商品预估结算金额',
          children: [
            {
              title: '当前指定商品预估结算金额',
              align: 'center',
              key: 'DiffItem_PayAmount_scale_pre',
              scopedSlots: { customRender: 'DiffItem_PayAmount_scale_pre' },
            },
            {
              title: '任务完成进度',
              align: 'center',
              width: 100,
              key: 'jindu4',
              scopedSlots: { customRender: 'jindu4' },
            },
            {
              title: '目标值',
              align: 'center',
              width: 100,
              key: 'mubiao4',
              scopedSlots: { customRender: 'mubiao4' },
            },
            {
              title: '今日指定商品预估结算金额',
              align: 'center',
              key: 'DiffItem_PayAmount_scale_pre_DayDelta',
              scopedSlots: { customRender: 'DiffItem_PayAmount_scale_pre_DayDelta' },
            },
          ]
        },
        {
          title: '月度直播GMV',
          children: [
            {
              title: '当前GMV',
              align: 'center',
              key: 'LiveCount_cpaReward_pre',
              scopedSlots: { customRender: 'LiveCount_cpaReward_pre' },
            },
            // {
            //   title: '任务完成进度',
            //   align: 'center',
            //   key: 'jindu5',
            //   scopedSlots: { customRender: 'jindu5' },
            // },
            // {
            //   title: '目标值',
            //   align: 'center',
            //   key: 'mubiao5',
            //   scopedSlots: { customRender: 'mubiao5' },
            // },
            {
              title: '今日直播GMV',
              align: 'center',
              key: 'LiveCount_cpaReward_pre_DayDelta',
              scopedSlots: { customRender: 'LiveCount_cpaReward_pre_DayDelta' },
            },
          ]
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
      let params = Object.assign({}, this.form)
      if(!params.groupId) params.groupId = 0
      if(params.time){
        params.time = moment(params.time).format('YYYY-MM-01')
      }
      getcpadetail(params).then(res => {
        this.data = res
        this.total = res.length
        this.tableLoading = false
      }).catch(() => {this.tableLoading = false})
    },
    handleSearch(){
      this.query()
    },
    daochu(){
      let params = Object.assign({}, this.form)
      if(!params.groupId) params.groupId = 0
      if(params.time){
        params.time = moment(params.time).format('YYYY-MM-01')
      }
      let paramsArr = []
      for(var i in params){
        paramsArr.push(i + '=' + params[i]) 
      }
      console.log('/api/d/bs/exportcpadetail?' + paramsArr.join('&'))
      window.open('/api/d/bs/exportcpadetail?' + paramsArr.join('&'))
    },
    chongzhi(){
      this.form = {
        time: null,
        groupId: '',
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
