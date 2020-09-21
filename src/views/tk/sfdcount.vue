<template lang="html">
  <div class="task-container">
    <a-range-picker :placeholder="['开始时间', '结束时间']" @change="onChange" />
    <a-button type="primary" style="margin-left: 10px;margin-bottom: 20px;" @click="search">
      查询
    </a-button>
    <a-tabs default-active-key="1">
     <a-tab-pane key="1" tab="用户数据">
       <h3 class="title">用户数据</h3>
       <a-table
         border
         :columns="userDataColumns"
         :rowKey="(record, index) => (index)"
         :pagination="{
           current: userPage,
           pageSize: userPageSize,
           total: userTotal,
           'show-quick-jumper': true,
           'show-total': userShowTotal,
         }"
         @change="userTableChange"
         :data-source="userDataList"></a-table>
     </a-tab-pane>
     <a-tab-pane key="2" tab="商品数据">
       <h3 class="title">商品数据</h3>
       <a-table
         border
         :columns="goodsDataColums"
         :rowKey="(record, index) => (index)"
         :pagination="{
           current: goodsPage,
           pageSize: goodsPageSize,
           total: goodsTotal,
           'show-quick-jumper': true,
           'show-total': goodsShowTotal,
         }"
         @change="goodsTableChange"
         :data-source="goodsDataList">
       </a-table>
     </a-tab-pane>
   </a-tabs>
  </div>
</template>

<script>
  import {shoufadanDataCount} from '@/api/auth'
  import {getCurrentDays, getBeforeDays} from '@/filters'

  // 全部数据列
  const userDataColumns = [
    {title: '日期',dataIndex: 'CDate',key: 'CDate',align: 'center'},
    {title: '新增注册量',dataIndex: 'Registers',key: 'Registers',align: 'center'},
    {title: '独立访问量',dataIndex: 'Visits',key: 'Visits',align: 'center'},
    {title: '申请推广用户（去重）',dataIndex: 'Applys',key: 'Applys',align: 'center'}
  ]


  const goodsDataColums = [
    {title: '日期',dataIndex: 'CDate',key: 'CDate',align: 'center'},
    {title: '总商品数',dataIndex: 'Items',key: 'Items',align: 'center'},
    {title: '跑单数量',dataIndex: 'RunOrders',key: 'RunOrders',align: 'center'},
    {title: '总GMV(元)',dataIndex: 'RunOrderGmv',key: 'RunOrderGmv',align: 'center', scopedSlots: 'RunOrderGmv'},
    {title: '总佣金',dataIndex: 'RunOrderCommission',key: 'RunOrderCommission',align: 'center'},
    {title: '总预估补贴',dataIndex: 'RunOrderSubAmount',key: 'RunOrderSubAmount',align: 'center'},

  ]

  // 用户数据分页器总数计算
  const userShowTotal = function (total, range) {

    return `共${total}条,每页${this.userPageSize}条,当前第${this.userPage}页`
  }
  // 商品数据分页器总数计算
  const goodsShowTotal = function (total, range) {

    return `共${total}条,每页${this.userPageSize}条,当前第${this.userPage}页`
  }
  export default {
    data() {
      return {
        BeginDate: '',
        EndDate: '',
        loading: false,
        userDataColumns: userDataColumns,
        userDataList: [],
        userTotal: 0,
        userPageSize:20,
        userPage: 1,
        userShowTotal:userShowTotal.bind(this),
        goodsShowTotal:goodsShowTotal.bind(this),
        goodsDataColums: goodsDataColums,
        goodsDataList: [],
        goodsTotal: 0,
        goodsPageSize:20,
        goodsPage: 1,

      }
    },
    methods:{
      onChange(date, dateString) {
        console.log(date, dateString);
        this.BeginDate = dateString[0]
        this.EndDate = dateString[1]
      },
      userTableChange(pagination, filters, sorter, {currentDataSource }) {
        const {current} = pagination
        this.userPage = current
        this.getList(1)
      },
      goodsTableChange(pagination) {
        const {current} = pagination
        this.goodsPage = current
        this.getList(2)
      },
      search() {
        this.userPage = 1
        this.goodsPage = 1
        this.getList()
      },
      getList(flag) {
        var params = {
          SDate : this.BeginDate , //
          EDate : this.EndDate,
          Page: flag ? (flag == 1 ? this.userPage : this.goodsPage) : 1
        }
        shoufadanDataCount(params).then(res => {

          console.log('首发单数据', res)
          if(res.data && res.data.hasOwnProperty('code')) {
            return this.$message.error(res.data.msg || '');
          }

          let reqList = res.PData || []
          this.userTotal = res.TotalCount || 0
          this.userPageSize = res.PageSize || 20
          this.goodsTotal = res.TotalCount || 0
          this.goodsPageSize = res.PageSize || 20

          let userDataList = reqList.map(item => ({
            CDate: item.CDate && item.CDate.split(' ')[0],
            Registers: item.Registers,
            Visits: item.Visits,
            Applys: item.Applys
          }))

          let goodsDataList = reqList.map(item => ({
            CDate: item.CDate && item.CDate.split(' ')[0],
            Items: item.Items,
            RunOrders: item.RunOrders,
            RunOrderGmv: item.RunOrderGmv / 100,
            RunOrderCommission: item.RunOrderCommission / 100,
            RunOrderSubAmount : item.RunOrderSubAmount / 100
          }))

          if (flag == 1) { // 只渲染用户数据
            this.userDataList = userDataList
          } else if (flag == 2) { // 只渲染商品数据
            this.goodsDataList = goodsDataList
          } else { // 同时渲染用户数据和商品数据
            this.userDataList = userDataList
            this.goodsDataList = goodsDataList
          }

        }).catch(err => {

        })
      }
    },
    mounted() {
      console.log('New component mounted.')
      this.getList()
    }
  }
</script>

<style lang="scss">
.task-container{
  .title{
    font-size: 16px;
    font-weight: bold;
    padding:10px 0;
    font-weight: bold;
  }
}
</style>
