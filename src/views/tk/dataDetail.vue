<template>
  <div>
    <a-card :bordered="false">
      <div style="margin-bottom: 30px;">
        <a href="javascript:history.go(-1);">&lt;&lt; 返回上一页</a>
      </div>
      <div style="margin-bottom: 15px;font-weight: bold">
        <a-row>
          <a-col :span="6">
            淘客ID：{{detailObj.TkId}}
          </a-col>
          <a-col :span="6">
            昵称：{{detailObj.Nick}}
          </a-col>
          <a-col :span="6">
            电话：{{detailObj.Mobile}}
          </a-col>
          <a-col :span="6">
            注册时间：{{detailObj.RegisterTime}}
          </a-col>
        </a-row>
      </div>
      <div style="margin-bottom: 15px;font-weight: bold">
        <a-row type="flex">
          <a-col :span="6">
            负责人：{{detailObj.HeadName}}
          </a-col>
          <a-col :span="6">
            备注：{{detailObj.Remark}}
          </a-col>
          <a-col :span="6">
            群组：{{detailObj.GroupName}}
          </a-col>
        </a-row>
      </div>
      
      <div style="margin-bottom: 15px">
        <a-radio-group v-model="isDorM" buttonStyle="solid" @change="radioChange">
          <a-radio-button :value="0">按日</a-radio-button>
          <a-radio-button :value="1">按月</a-radio-button>
        </a-radio-group>
      </div>

      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="CData"
      >
        <span slot="date" slot-scope="row">{{row.CData && row.CData.slice(0,10)}}</span>
        <span slot="TdCommission" slot-scope="row">{{_mformat(parseInt(row.TdCommission/100))}}</span>
        <span slot="TdAppKeyCommission" slot-scope="row">{{_mformat(parseInt(row.TdAppKeyCommission/100))}}</span>
        <span slot="TdGmv" slot-scope="row">{{_mformat(parseInt(row.TdGmv/100))}}</span>
        <span slot="TdAppKeyGmv" slot-scope="row">{{_mformat(parseInt(row.TdAppKeyGmv/100))}}</span>
        <span slot="IsPx" slot-scope="row">{{row.IsPx == 1 ? '是' : '否'}}</span>
      </a-table>

      <div style="margin-top: 50px;">
        <ve-line :data="chartData"></ve-line>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { tkQpDetail } from '@/api/auth.js'
export default {
  name: 'tk-dataDetail',
  data(){
    return {
      detailObj: {},
      isDorM: 0,// 0按日 1按月 默认不传为0
      rangeDate: [moment(),moment()],
      columns: [
        {
          title: '日期',
          width: 70,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '团队总订单数',
          align: 'right',
          dataIndex: 'TdOrderCount'
        },
        {
          title: '团队总订单数(AppKey)',
          align: 'right',
          dataIndex: 'TdAppKeyOrderCount'
        },
        {
          title: '淘客自购订单数',
          align: 'right',
          dataIndex: 'TkOrderCount'
        },
        {
          title: '淘客自购订单数(AppKey)',
          align: 'right',
          dataIndex: 'TkAppKeyOrderCount'
        },
        {
          title: '代理订单数',
          align: 'right',
          dataIndex: 'UOrderCount'
        },
        {
          title: '代理订单数(AppKey)',
          align: 'right',
          dataIndex: 'UAppKeyOrderCount'
        },
        {
          title: '团队总佣金',
          align: 'right',
          scopedSlots: { customRender: 'TdCommission' },
        },
        {
          title: '团队总佣金(AppKey)',
          align: 'right',
          scopedSlots: { customRender: 'TdAppKeyCommission' },
        },
        {
          title: '团队GMV',
          align: 'right',
          scopedSlots: { customRender: 'TdGmv' },
        },
        {
          title: '团队GMV(AppKey)',
          align: 'right',
          scopedSlots: { customRender: 'TdAppKeyGmv' },
        },
        {
          title: '总用户数',
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
          align: 'right',
          dataIndex: 'NewTkLx',
        },
        {
          title: '用户拉新人数',
          align: 'right',
          dataIndex: 'NewULx',
        },
        {
          title: '培训',
          width: 40,
          align: 'center',
          scopedSlots: { customRender: 'IsPx' },
        },


        // TdOrderCount (integer, optional): 团队总订单数 ,
        // TdAppKeyOrderCount (integer, optional): 团队总订单数(AppKey) ,
        // TkOrderCount (integer, optional): 淘客自购订单数 ,
        // TkAppKeyOrderCount (integer, optional): 淘客自购订单数(AppKey) ,
        // UOrderCount (integer, optional): 代理订单数 ,
        // UAppKeyOrderCount (integer, optional): 代理订单数(AppKey) ,

        // TdCommission (integer, optional): 团队总佣金x100 ,
        // TdAppKeyCommission (integer, optional): 团队总佣金(AppKey)x100 ,
        // TdGmv (integer, optional): 团队GMVx100 ,
        // TdAppKeyGmv (integer, optional): 团队GMV(AppKey)x100 ,

        // UCount (integer, optional): 总用户数 ,
        // NewUCount (integer, optional): 新增人数 ,
        // NewTkLx (integer, optional): 淘客拉新人数 ,
        // NewULx (integer, optional): 用户拉新人数 ,
        // IsPx (integer, optional): 是否培训 1是 0否
      ],
      data: [],
      chartData: {
        columns: ['日期', '团队总佣金'],
        rows: []
      }
    }
  },
  methods: {
    query(){
      console.log(this.$route.query.id)
      if(this.$route.query.id){
        tkQpDetail({
          tkId: this.$route.query.id,
          isDorM: this.isDorM
        }).then(res => {
          this.detailObj = res
          this.data = res.DataList
          this.chartData.rows = []
          this.data.forEach((value, index) => {
            this.chartData.rows.unshift({
              '日期': value.CData.slice(0,10),
              '团队总佣金': value.TdCommission / 100
            })
          })
        })
      }
      
    },
    handleSearch(){
      this.Page = 1
      this.query()
    },
    onCellChange(row, value) {
      console.log(row.Remark, value)
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
    radioChange(){
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
<style lang="scss">
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 12px 3px;
  }
</style>
