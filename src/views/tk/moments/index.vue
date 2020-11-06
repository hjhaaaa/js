<template>
  <div class="moments">
    <a-card title="发朋友圈">
      <a-row :gutter="20">
        <a-col :span="6">
          <a-card>
            <a-button type="primary" class="margin-btn">发淘宝</a-button>
            <a-button type="primary" class="margin-btn">发拼多多</a-button>
            <a-button type="primary" class="margin-btn">发素材</a-button>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-table :columns="columns" :data-source="data" bordered>
            
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div>今日各分组发圈个数：</div>
          <div>
            <a-table :columns="columns1" :data-source="data1" bordered>
              <template slot="Goods" slot-scope="row">
                <div>
                  {{row.Pics}}
                </div>
              </template>
              <template slot="ItemType" slot-scope="row">
                {{row.ItemType | ItemTypeFilter}}
              </template>
              <template slot="caozuo" slot-scope="row">
                <div>
                  <a-button type="primary" class="margin-btn">发淘宝</a-button>
                </div>
              </template>
            </a-table>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { sendSnsList } from '@/api/tk/moments'

export default {
  name: 'moments',
  data() {
    return {
      columns: [
        {
          title: '圈名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '圈描述',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '今日发送量',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '跟发开关',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
      ],
      data: [],
      
      columns1: [
        {
          title: '商品',
          scopedSlots: { customRender: 'Goods' },
        },
        {
          title: '来源',
          align: 'center',
          scopedSlots: { customRender: 'ItemType' },
        },
        // {
        //   title: '分组名',
        //   dataIndex: 'name',
        //   scopedSlots: { customRender: 'name' },
        // },
        {
          title: '发送时间',
          dataIndex: 'SendTime',
        },
        // {
        //   title: '发送方式',
        //   dataIndex: 'name',
        //   scopedSlots: { customRender: 'name' },
        // },
        {
          title: '类型',
          dataIndex: 'SendType',
        },
        {
          title: '状态',
          dataIndex: 'DealStatus',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'caozuo' },
        },
      ],
      data1: [],
      list1Query: {
        PageNum: 1
      }
    }
  },
  created() {
    this.query1()
  },
  methods: {
    query1(){
      sendSnsList(this.list1Query).then(res => {
        this.data1 = res.Data
      })
    }
  },
  filters: {
    ItemTypeFilter(_val){
      let txt = ''
      if(_val === 1){
        txt = '多多进宝'
      }else{
        txt = '淘宝联盟'
      }
      return txt
    },
  }
}
</script>

<style lang="scss" scoped>
.moments{
  .margin-btn{
    margin: 0 10px 10px 0;
  }
}
</style>


