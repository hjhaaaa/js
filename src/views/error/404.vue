<template>
  <div class="error-404">
    <img class="error-img-bg" src="../../assets/images/macbook-gold.png" alt />
    <div class="error-content">
      <img class="content-img" src="../../assets/images/404.png" alt />
      <div class="content-div">抱歉，找不到您访问的资源啦 :(</div>
      <button @click="$router.replace('/')" type="button" class="content-btn">←&nbsp; 返回首页</button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.error-404{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 0;
  background-color: #7f6c5b;
  .error-img-bg{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
  }
  .error-content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    color: #FFF;
    text-align: center;
    .content-img{
      width: 360px;
    }
    .content-div{
      font-size: 26px;
      font-weight: bold;
      margin-top: 10px;
    }
    .content-btn{
      font-size: 24px;
      line-height: 46px;
      border: 0;
      background-color: #ee8c94;
      margin-top: 10px;
      padding: 0 20px;
      border-radius: 5px;
      cursor: pointer;
      outline: none;
    }
  }
}
</style>
