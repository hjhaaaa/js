<template lang="html">
  <div class="task-container">
    <a-range-picker :placeholder="['开始时间', '结束时间']" @change="onChange" />
    <a-button type="primary" style="margin-left: 10px;margin-bottom: 20px;" @click="search">
      查询
    </a-button>
    <h3 class="title">总体数据</h3>
    <a-table border :columns="allDataColumns" :pagination="false" :data-source="allDataList"></a-table>
    <h3 class="title">发放数据</h3>
    <a-table border :columns="fafangColumns" :pagination="false" :data-source="fafangDataList"></a-table>
    <h3 class="title">消耗数据</h3>
    <a-table border :columns="consumeColumns" :pagination="false" :data-source="consumeDataList"></a-table>
  </div>
</template>

<script>
  import {coinCountList} from '@/api/auth'
  import {getCurrentDays, getBeforeDays} from '@/filters'

  // 全部数据列
  const allDataColumns = [{title: '日期',dataIndex: 'DataDate',key: 'DataDate',align: 'center'},{title: '总持有',dataIndex: 'AllGoldCount',key: 'AllGoldCount',align: 'center'},{title: '活跃人数',dataIndex: 'FinishTaskUserCount',key: 'FinishTaskUserCount',align: 'center'}]

  // 消耗数据列
  const consumeColumns = [{title: '日期',dataIndex: 'DataDate',align: 'center'},{title: '总消耗',dataIndex: 'TodayUsedGoldCount',align: 'center'},{title: '参与消耗人数',dataIndex: 'TodayUseGoldUserCount',align: 'center'},{title: '兑换消耗',dataIndex: 'TodayExchangeGoldCount',align: 'center'},
  {title: '红包消耗',dataIndex: 'TodayRedPackageGoldCount',align: 'center'}]

  // 发放数据列
  const fafangColumns = [{
    title:'日期',
    dataIndex: 'DataDate',
    align: 'center'
  },{
    title:'总发放',
    dataIndex: 'TodayGoldCount',
    align: 'center'
  },{
    title:'领取新人免单福利',
    // dataIndex: 'TodayTask1GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask1GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask1UserCount',
        align: 'center'
      }
    ]
  },{
    title:'完成第一笔淘宝订单',
    // dataIndex: 'TodayTask2GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask2GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask2UserCount',
        align: 'center'
      }
    ]
  },{
    title:'新人第一课',
    // dataIndex: 'TodayTask3GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask3GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask3UserCount',
        align: 'center'
      }
    ]
  },{
    title:'填写微信',
    // dataIndex: 'TodayTask4GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask4GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask4UserCount',
        align: 'center'
      }
    ]
  },{
    title:'每日签到',
    // dataIndex: 'TodayTask5GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask5GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask5UserCount',
        align: 'center'
      }
    ]
  },{
    title:'每日淘宝订单',
    // dataIndex: 'TodayTask6GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask6GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask6UserCount',
        align: 'center'
      }
    ]
  },{
    title:'邀请好友',
    // dataIndex: 'TodayTask7GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask7GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask7UserCount',
        align: 'center'
      }
    ]
  },{
    title:'每日分享',
    // dataIndex: 'TodayTask8GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask8GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask8UserCount',
        align: 'center'
      }
    ]
  },{
    title:'今日必看',
    // dataIndex: 'TodayTask9GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask9GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask9UserCount',
        align: 'center'
      }
    ]
  },{
    title:'每日打卡',
    // dataIndex: 'TodayTask10GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask10GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask10UserCount',
        align: 'center'
      }
    ]
  },{
    title:'答题',
    // dataIndex: 'TodayTask11GoldCount',
    align: 'center',
    children:[
      {
        title:'发放金币数',
        dataIndex: 'TodayTask11GoldCount',
        align: 'center'
      },
      {
        title:'完成人数',
        dataIndex: 'TodayTask11UserCount',
        align: 'center'
      }
    ]
  }]

  export default {
    data() {
      return {
        BeginDate: '',
        EndDate: '',
        loading: false,
        allDataColumns: allDataColumns,
        allDataList: [],
        consumeColumns: consumeColumns,
        consumeDataList: [],
        fafangColumns: fafangColumns,
        fafangDataList: []
      }
    },
    methods:{
      onChange(date, dateString) {
        console.log(date, dateString);
        this.BeginDate = dateString[0]
        this.EndDate = dateString[1]
      },
      search() {
        this.getList()
      },
      getList() {
        var params = {
          BeginDate: this.BeginDate || getBeforeDays(7, 'YYYY-MM-DD'), // 默认近7天数据
          EndDate: this.EndDate || getCurrentDays('YYYY-MM-DD')
        }
        coinCountList(params).then(res => {
          if(res.data && res.data.hasOwnProperty('code')) {
            return this.$message.error(res.data.msg || '');
          }

          let reqList = res || []

          // 整体数据
          this.allDataList = reqList.map(item => ({
            DataDate: item.DataDate,
            AllGoldCount: item.AllGoldCount,
            FinishTaskUserCount: item.FinishTaskUserCount
          }))

          // 消耗数据
          this.consumeDataList = reqList.map(item => ({
              DataDate: item.DataDate,
              TodayUsedGoldCount: item.TodayUsedGoldCount || 0, // 今日使用的金币总数（总消耗）
              TodayUseGoldUserCount: item.TodayUseGoldUserCount || 0, // 今日使用过金币的用户数(参与消耗人数)
              TodayExchangeGoldCount: item.TodayExchangeGoldCount || 0, // 今日兑换现金消耗的金币数(兑换金币消耗)
              TodayRedPackageGoldCount: item.TodayRedPackageGoldCount || 0 // 今日红包抽奖消耗的金币数 (抽红包消耗)
          }))

          // 方法数据
          this.fafangDataList = reqList.map(item => ({
              DataDate: item.DataDate,
              TodayGoldCount: item.TodayGoldCount,
              TodayTask1GoldCount: item.TodayTask1GoldCount || 0,
              TodayTask1UserCount: item.TodayTask1UserCount || 0,
              TodayTask2GoldCount: item.TodayTask2GoldCount || 0,
              TodayTask2UserCount: item.TodayTask2UserCount || 0,
              TodayTask3GoldCount: item.TodayTask3GoldCount || 0,
              TodayTask3UserCount: item.TodayTask3UserCount || 0,
              TodayTask4GoldCount: item.TodayTask4GoldCount || 0,
              TodayTask4UserCount: item.TodayTask4UserCount || 0,
              TodayTask5GoldCount: item.TodayTask5GoldCount || 0,
              TodayTask5UserCount: item.TodayTask5UserCount || 0,
              TodayTask6GoldCount: item.TodayTask6GoldCount || 0,
              TodayTask6UserCount: item.TodayTask6UserCount || 0,
              TodayTask7GoldCount: item.TodayTask7GoldCount || 0,
              TodayTask7UserCount: item.TodayTask7UserCount || 0,
              TodayTask8GoldCount: item.TodayTask8GoldCount || 0,
              TodayTask8UserCount: item.TodayTask8UserCount || 0,
              TodayTask9GoldCount: item.TodayTask9GoldCount || 0,
              TodayTask9UserCount: item.TodayTask9UserCount || 0,
              TodayTask10GoldCount: item.TodayTask10GoldCount || 0,
              TodayTask10UserCount: item.TodayTask10UserCount || 0,
              TodayTask11GoldCount: item.TodayTask11GoldCount || 0,
              TodayTask11UserCount: item.TodayTask11UserCount || 0
          }))
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
