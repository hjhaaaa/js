<template>
  <div class="top-goods">
    <div class="goods-box">
      <img class="img-l" :src="topInfo.Pic" alt="">
      <div class="div-l">
        <div class="div1">价格：¥{{topInfo.topPrice}}</div>
        <div class="div2">
          <div class="div2-2">¥{{topInfo.qhPrice}}<br/>券后价</div>
          <div class="div2-2">{{topInfo.Rate / 100}}%<br/>佣金比例</div>
          <div class="div2-2">¥{{topInfo.yongPrice}}<br/>佣金金额</div>
        </div>
        <div class="div3">
          推荐文案：<br/>
          {{topInfo.Recommend}}
        </div>
      </div>
      <div class="div-r">
        <div>优惠券面额{{topInfo.QuanAmount / 100}}元</div>
        <div style="margin-top: 15px">优惠券数量：{{topInfo.QuanLeftCount}}/{{topInfo.QuanTotalCount}}</div>
        <div style="margin-top: 15px">劵有效期：{{topInfo.QuanStartTime}}---{{topInfo.QuanEndTime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'top-goods',
  data() {
    return {
      
    }
  },
  props: {
    topInfo: {
      default: () => {
        return {}
      },
      type: Object,
    },
  },
  created() {
    
  },
  watch: {

  },
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>
.top-goods{
  padding-bottom: 20px;
  border-bottom: 1px solid #CCC;
  .goods-box{
    overflow: hidden;
    .img-l{
      float: left;
      width: 160px;
      height: 160px;
    }
    .div-l{
      float: left;
      width: 260px;
      margin-left: 30px;
      .div1{
        
      }
      .div2{
        margin-top: 15px;
        overflow: hidden;
        .div2-2{
          float: left;
          margin-right: 15px;
          text-align: center;

        }
      }
      .div3{
        margin-top: 15px;
      }
    }
    .div-r{
      float: left;
      width: 350px;
      margin-left: 30px;
    }
  }
}
</style>


