<template>
  <div class="moments">
    <a-card title="发朋友圈">
      <div>
        <a-row :gutter="20">
          <a-col :span="6">
            <a-card>
              <a-button type="primary" class="margin-btn" @click="faTaobao">发淘宝</a-button>
              <a-button type="primary" class="margin-btn" @click="faPdd">发拼多多</a-button>
              <a-button type="primary" class="margin-btn" @click="faSucai">发素材</a-button>
            </a-card>
          </a-col>
          <a-col :span="18">
            <a-table :columns="columns" :data-source="data" rowKey="Id" bordered>
              
            </a-table>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <div>今日各分组发圈个数：
              <p>
                <span style="margin-right: 20px" v-for="(itemval ,itemkey, index) in ObjData" :key="index">
                  {{itemkey}}： {{itemval}}个
                </span>
              </p>
            </div>
            <div>
              <a-table :columns="columns1" :data-source="data1" rowKey="Id" :pagination="false" bordered>
                <template slot="Goods" slot-scope="row">
                  <div>
                    <img v-if="row.Pics.split(',')[0]" :src="row.Pics.split(',')[0]" style="width: 100px;height: 100px" alt="">
                    <div>
                      <p v-if="row.ItemType != 2">商品Id: {{row.ItemId}}</p>

                      <a-button type="link" v-if="row.ItemType == 0" @click="$router.push({
                        path:'/moments/tbDetail', 
                        query: {
                          ItemUrl: row.ItemId,
                          QuanUrl: row.QuanId,
                        }
                      })">查看详情</a-button>

                      <a-button type="link" v-if="row.ItemType == 1" @click="$router.push({
                        path:'/moments/pddDetail', 
                        query: {
                          ItemUrl: row.ItemId,
                        }
                      })">查看详情</a-button>
                    </div>
                  </div>
                </template>
                <template slot="ItemType" slot-scope="row">
                  {{row.ItemType | ItemTypeFilter}}
                </template>
                <template slot="SendType" slot-scope="row">
                  {{row.SendType | SendTypeFilter}}
                </template>
                <template slot="DealStatus" slot-scope="row">
                  {{row.DealStatus | DealStatusFilter}}
                </template>

                <template slot="caozuo" slot-scope="row">
                  <div>
                    <a-button type="link" v-if="row.DealStatus == 0" @click="chexiao(row)">撤销</a-button>
                    <a-button type="link" v-if="row.DealStatus == 2||row.DealStatus == 1" @click="reSend(row, 2)">重新排队发送</a-button>
                    <a-button type="link" v-if="row.DealStatus == 2||row.DealStatus == 1" @click="reSend(row, 1)">重新立即发送</a-button>
                  </div>
                </template>
              </a-table>
            </div>
            <div style="margin-top: 15px">
              <a-pagination
                size="small"
                :pageSize="20"
                v-model="list1Query.PageNum"
                @change="pageChange"
                :total="total1"
                showQuickJumper
                :showTotal="() => `共${total1}条`"
              />
            </div>
          </a-col>
        </a-row>
      </div>
      
    </a-card>

    <a-modal v-model="visibleTb" title="发淘宝商品" @ok="handleTbOk" width="800px" class="moments-modal-tb">
      <div>
        <a-form :form="formTb" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
          <a-form-item label="商品链接">
            <a-input
              v-decorator="['ItemUrl', { rules: [{ required: true, message: '请输入商品链接' }] }]"
            />
          </a-form-item>
          <a-form-item label="券链接">
            <a-input
              v-decorator="['QuanUrl']"
            />
            <a-button type="primary" @click="yanzhen">验证商品</a-button>
          </a-form-item>
        </a-form>
        <div class="goods-div" v-if="tbGoods">
          <img class="img-l" :src="tbGoods.Pic" alt="">
          <div class="div-r">
            <div class="div1">{{tbGoods.Title}}</div>
            <div class="div2">价格：{{tbGoods.Price / 100}}元</div>
            <div class="div3">券后价：{{qhPrice}}元</div>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal v-model="visiblePdd" title="发拼多多商品" @ok="handlePddOk" width="800px" class="moments-modal-tb">
      <div>
        <a-form :form="formPdd" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
          <a-form-item label="商品链接">
            <a-input
              v-decorator="['ItemUrl', { rules: [{ required: true, message: '请输入商品链接' }] }]"
            />
            <a-button type="primary" @click="yanzhenPdd">验证商品</a-button>
          </a-form-item>
        </a-form>
        <div class="goods-div" v-if="pddGoods">
          <img class="img-l" :src="pddGoods.ItemImg" alt="">
          <div class="div-r">
            <div class="div1">{{pddGoods.ItemTitle}}</div>
            <div class="div2">价格：{{pddGoods.Price / 100}}元</div>
            <div class="div3">券后价：{{pddQhPrice}}元</div>
          </div>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>
import { sendSnsList, sendSnsTbItemDetail, sendSnsPddItemDetail, sendNow, rewriteQueue, cancelQuan } from '@/api/tk/moments';
import tipMessage from '@/utils/messageUtil'

export default {
  name: 'moments',
  data() {
    return {
      columns: [
        {
          title: '圈名称',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '圈描述',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '今日发送量',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '跟发开关',
          scopedSlots: { customRender: 'name' },
        },
      ],
      data: [],
      ObjData: null,
      columns1: [
        {
          title: '商品',
          align: 'center',
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
          align: 'center',
          dataIndex: 'SendTime',
        },
        // {
        //   title: '发送方式',
        //   dataIndex: 'name',
        //   scopedSlots: { customRender: 'name' },
        // },
        {
          title: '类型',
          align: 'center',
          scopedSlots: { customRender: 'SendType' },
        },
        {
          title: '状态',
          align: 'center',
          scopedSlots: { customRender: 'DealStatus' },
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          scopedSlots: { customRender: 'caozuo' },
        },
      ],
      data1: [],
      list1Query: {
        PageNum: 1
      },
      total1: 0,
      visibleTb: false,
      visiblePdd: false,
      formTb: this.$form.createForm(this),
      formPdd: this.$form.createForm(this),
      tbGoods: null,
      pddGoods: null,
    }
  },
  computed: {
    qhPrice() {
      if (this.tbGoods) {
        // 券后价=折扣价*数量-店减-券
        let price = this.tbGoods.Price*this.tbGoods.ItemNum
        // let price = this.goodsDetail.DiscountPrice
        let QuanAmount = this.tbGoods.QuanAmount || 0
        let ShopJian = this.tbGoods.ShopJian
        return Math.round(price - QuanAmount - ShopJian) / 100
      }

      return 0
    },
    pddQhPrice(){
      if (this.pddGoods) {
        // 券后价=折扣价*数量-店减-券
        let price = this.pddGoods.Price*this.pddGoods.ItemNum
        // let price = this.goodsDetail.DiscountPrice
        let QuanAmount = this.pddGoods.QuanAmount || 0
        let ShopJian = this.pddGoods.ShopJian
        return Math.round(price - QuanAmount - ShopJian) / 100
      }

      return 0
    }
  },
  created() {
    this.query1()
  },
  methods: {
    query1(){
      sendSnsList(this.list1Query).then(res => {
        this.data1 = res.Data
        this.total1 = res.TotalCount
        this.ObjData = res.ObjData
      })
    },
    faTaobao(){
      this.visibleTb = true
    },
    yanzhen(){
      this.formTb.validateFields((err, values) => {
        if(!err){
          values.QuanUrl = values.QuanUrl || '';
          sendSnsTbItemDetail(values).then(res => {
            this.tbGoods = res.Data.ItemInfo
          }).catch(error => {

          })
        }
      })
    },
    faPdd(){
      this.visiblePdd = true
    },
    yanzhenPdd(){
      this.formPdd.validateFields((err, values) => {
        if(!err){
          sendSnsPddItemDetail(values).then(res => {
            this.pddGoods = res.Data.ItemInfo
          }).catch(error => {

          })
        }
      })
    },
    faSucai(){
      this.$router.push('/moments/scDetail')
    },
    handleTbOk(){
      if(!this.tbGoods){
        return tipMessage.info('请先验证商品')
      }
      const {ItemUrl, QuanUrl} = this.formTb.getFieldsValue()
      this.$router.push({
        path: '/moments/tbDetail',
        query: {
          ItemUrl,
          QuanUrl: QuanUrl||'',
        }
      })
    },
    handlePddOk(){
      if(!this.pddGoods){
        return tipMessage.info('请先验证商品')
      }
      const {ItemUrl} = this.formPdd.getFieldsValue()
      this.$router.push({
        path: '/moments/pddDetail',
        query: {
          ItemUrl
        }
      })
    },
    chexiao(row){
      this.$confirm({
        title: '提示',
        content: '确定撤销发送吗？',
        onOk:() => {
          cancelQuan({
            id: row.Id
          }).then(res => {
            tipMessage.success('撤销成功')
            this.query1()
          }).catch(err => {

          })
        },
        onCancel() {},
      });
    },
    reSend(row, type){
      let funcName = sendNow
      if(type == 2){
        funcName = rewriteQueue
      }

      funcName({
        id: row.Id
      }).then(res => {
        tipMessage.success('操作成功')
        this.query1()
      }).catch(err => {

      })
      
    },
    pageChange(p, s) {
			this.list1Query.PageNum = p
			this.query1()
		},
  },
  filters: {
    ItemTypeFilter(_val){
      let txt = ''
      if(_val === 0){
        txt = '淘宝联盟'
      }else if(_val === 1){
        txt = '多多进宝'
      }else if(_val === 2){
        txt = '素材'
      }
      return txt
    },
    SendTypeFilter(_val){
      let txt = ''
      if(_val === 0){
        txt = '自己'
      }else if(_val === 1){
        txt = '团队'
      }
      return txt
    },
    DealStatusFilter(_val){
      let txt = ''
      if(_val === 0){
        txt = '待发送'
      }else if(_val === 1){
        txt = '已发送'
      }else if(_val === 2){
        txt = '撤销'
      }
      return txt
    }
    
  }
}
</script>

<style lang="scss" scoped>
.moments{
  // width: 100%;
  min-width: 800px;
  overflow: scroll;
  .margin-btn{
    margin: 0 10px 10px 0;
  }
}
</style>
<style lang="scss">
.moments-modal-tb{
  .goods-div{
    overflow: hidden;
    .img-l{
      float: left;
      width: 150px;
      height: 150px;
      margin-left: 100px;
      margin-right: 20px;
    }
    .div-r{
      float: left;
      .div1{
        height: 42px;
        margin-bottom: 10px;
        overflow: hidden;
      }
      .div2{
        margin-bottom: 10px;
      }
      .div3{
      }
    }
  }
}
</style>



