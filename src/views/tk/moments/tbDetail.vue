<template>
  <div class="moments-tbDetail">
    <a-card>
      <div>
        <TopGoods :topInfo="topInfo"></TopGoods>
        <h2 class="h2">朋友圈或微信群推广</h2>
        <a-row :gutter="20">
          <a-col :span="12">
            <h3 class="h3">1.主题文案:朋友圈主题文案或者微信群发单的推荐文案</h3>
            <div>
              <a-textarea
                ref="Recommend"
                @focus="textfoc('Recommend')"
                v-model="con.Recommend"
                :autosize="{ minRows: 6, maxRows: 6 }" 
              />
            </div>
            <div style="margin-top: 10px;">
              <a-button 
                v-for="(item, index) in buttonArr"
                :key="index"
                class="g-btn" 
                type="primary" 
                @click="insertText(`#${item.name}#`)">{{item.name}}</a-button>
            </div>
          </a-col>
          <a-col :span="12">
            <h3 class="h3">
              2.朋友圈或微信群图片：此图片或视频效果不佳，您可通过手机下载此商品或类似商品的买家秀图片或视频作为推广素材，提升转化率
            </h3>
            <ul class="piclist">
              <template v-for="(item, index) in Pics">
                <li class="pic-item" :key="index"
                  draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  @dragover.prevent="handleDragOver($event, item)"
                  @dragenter="handleDragEnter($event, item)"
                  @dragend="handleDragEnd($event, item)"
                >
                  <span class="close-layer">
                    <a-icon class="icon-delete" type="delete" @click="deletePic(index)"/>
                  </span>
                  <img :src="item" alt="">
                </li>
              </template>

              <li class="pic-btn">
                <a-upload
                  action="/api/UploadFile/Image"
                  list-type="picture-card"
                  multiple
                  :showUploadList="false"
                  @change="handleChange"
                >
                  <div v-if="Pics.length < 20">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                      上传
                    </div>
                  </div>
                </a-upload>
              </li>
            </ul>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="12">
            <h3 class="h3">3.(1)第一条评论: 发朋友圈时生效（评论区可编辑并直接转发）
              <a-switch checked-children="开" un-checked-children="关" v-model="UseCommoneModel" />
            </h3>
            <div style="margin-top: 5px">
              <a-textarea
                ref="FirComment"
                @focus="textfoc('FirComment')"
                v-model="con.FirComment"
                :autosize="{ minRows: 6, maxRows: 6 }" 
              />
            </div>
          </a-col>
          <a-col :span="12">
            <h3 class="h3">(2)第二条评论: 发朋友圈时生效（评论区可编辑并直接转发）
              <a-switch checked-children="开" un-checked-children="关" v-model="UseCommtwoModel" />
            </h3>
            <div style="margin-top: 5px">
              <a-textarea
                ref="SecComment"
                @focus="textfoc('SecComment')"
                v-model="con.SecComment"
                :autosize="{ minRows: 6, maxRows: 6 }" 
              />
            </div>
          </a-col>
          <a-col :span="24">
            <div style="margin-top: 10px;">
              <a-button 
                v-for="(item, index) in buttonArr"
                :key="index"
                class="g-btn" 
                type="primary" 
                @click="insertText(`#${item.name}#`)">{{item.name}}</a-button>
            </div>
          </a-col>
          <a-col :span="24" style="margin-top: 5px">
            发送方式&ensp;&ensp;
            <a-radio-group v-model="fangshiValue">
              <a-radio :value="1">系统默认排序发送</a-radio>
              <a-radio :value="2">
                定时发送
                <a-date-picker v-model="sendData.SendTime" show-time placeholder="请选择发送时间" />
              </a-radio>
              <a-radio :value="3">插队立即发送</a-radio>
            </a-radio-group>
          </a-col>

          <a-col :span="24" style="margin-top: 5px">
            发送范围&ensp;&ensp;
            <a-radio-group v-model="fanweiValue">
              <a-radio :value="1">
                选择分组
                <a-select v-model="sendData.ClassifyId" style="width: 120px" placeholder="请选择分组">
                  <a-select-option 
                    v-for="(item, index) in classList"
                    :key="index"
                    :value="item.Id">{{item.Name}}</a-select-option>
                </a-select>
              </a-radio>
              <a-radio :value="2">仅自己</a-radio>
            </a-radio-group>
          </a-col>

          <a-col :span="24" style="text-align: center;margin-top: 20px">
            <a-button type="primary" style="width: 200px" @click="send">确定发送</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import TopGoods from './components/top-goods';
import { sendSnsSendSns, sendSnsTbItemDetail } from '@/api/tk/moments';
import tipMessage from '@/utils/messageUtil';
import moment from 'moment'

export default {
  name: 'moments-tbDetail',
  data() {
    return {
      queryObj: {
        ItemUrl: this.$route.query.ItemUrl,
        QuanUrl: this.$route.query.QuanUrl,
      },
      goodsInfo: {

      },
      topInfo: {

      },
      selectRefText: 'Recommend',
      buttonArr: [
        {
          name: '随机表情',
        },{
          name: '淘口令',
        },{
          name: '短链接',
        },{
          name: '原价',
        },{
          name: '券后价',
        },{
          name: '券值',
        },{
          name: 'APP邀请码',
        }
      ],
      con: {
        Recommend: '',
        FirComment: '',
        SecComment: '',
      },
      Pics: [],
      dragging: null,
      fangshiValue: '',
      fanweiValue: '',
      sendData: {
        SendTime: null,
        IsJump: 0,
        ClassifyId: '',
      },
      classList: [
        {
          Id: 1,
          Name: 'zu1',
        }, {
          Id: 2,
          Name: '测试2',
        }, {
          Id: 3,
          Name: '测试3',
        }
      ],
      UseCommoneModel: false,
      UseCommtwoModel: false,
    }
  },
  components: {
    TopGoods
  },
  created() {
    this.query()
  },
  methods: {
    query(){
      sendSnsTbItemDetail(this.queryObj).then(res => {
        this.goodsInfo = res.Data.ItemInfo;

        const {FirComment, SecComment, UseCommoneModel, UseCommtwoModel} = res.Data
        const {Pic, Price, ItemNum, QuanAmount, ShopJian, Rate, Recommend, 
          QuanLeftCount, QuanTotalCount, QuanStartTime, QuanEndTime, SmallImages} = this.goodsInfo;

        const qhPrice = Math.round(Price * ItemNum - QuanAmount - ShopJian) / 100;
        const yongPrice = Math.round(qhPrice * Rate / 100) /100;

        this.topInfo = {
          Pic,
          topPrice: Price ? Price * ItemNum / 100 : '',
          qhPrice,
          Rate,
          yongPrice,
          Recommend,
          QuanAmount,
          QuanLeftCount,
          QuanTotalCount,
          QuanStartTime,
          QuanEndTime,
        };

        this.con = {
          Recommend,
          FirComment,
          SecComment
        }

        this.UseCommoneModel = UseCommoneModel == 1;
        this.UseCommtwoModel = UseCommtwoModel == 1;

        this.Pics = [Pic, ...SmallImages]
      }).catch(error => {

      })
    },
    send(){

      let IsJump = 0;
      let SendTime = '';
      if(this.fangshiValue == 1){

      }else if(this.fangshiValue == 2){
        if(!this.sendData.SendTime){
          return tipMessage.info('定时发送请选择发送时间');
        }
        SendTime = moment(this.sendData.SendTime).format('YYYY-MM-DD HH:mm:ss');
      }else if(this.fangshiValue == 3){
        IsJump = 1
      }

      let ClassifyId = '';
      if(this.fanweiValue == 1){
        if(!this.sendData.ClassifyId){
          return tipMessage.info('请选择分组');
        }
        ClassifyId = this.sendData.ClassifyId
      }else if(this.fanweiValue == 2){

      }

      const {ItemId} = this.goodsInfo;
      const { Recommend, FirComment, SecComment} = this.con;

      let params = Object.assign({
        temType: 0, // 淘宝
        ItemId,
        Content: Recommend,
        Pics: this.Pics,
        CommentOne: FirComment,
        CommentOneBut: this.UseCommoneModel ? 1 : 0,
        CommentTow: SecComment,
        CommentTowBut: this.UseCommtwoModel ? 1 : 0,
        SendTime,
        SendType: 0, // 个人
        QuanUrl: this.queryObj.QuanUrl,
        IsJump,
        ClassifyId,
      })

      console.log(params)

      sendSnsSendSns(params).then(res => {
        console.log(res)
        tipMessage.success(res.Msg)
        this.$router.push('/moments/index')
      }).catch(err => {

      })
    },
    textfoc(t){
      this.selectRefText = t
    },
    insertText(inValue){
      try {
        let _el = this.$refs[this.selectRefText].$el
        let startPos = _el.selectionStart
        let endPos = _el.selectionEnd
        let restoreTop = _el.scrollTop

        _el.value = _el.value.substring(0, startPos) + inValue + _el.value.substring(endPos, _el.value.length)
        this.con[this.selectRefText] = _el.value
        if (restoreTop > 0) {
          _el.scrollTop = restoreTop;
        }
        _el.focus()
        _el.selectionStart = startPos + inValue.length
        _el.selectionEnd = startPos + inValue.length
      } catch (error) {
        tipMessage.error('插入错误：' + error)
      }
    },
    handleDragStart(e,item){
      this.dragging = item;
    },
    handleDragEnd(e,item){
     this.dragging = null
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e,item){
      e.dataTransfer.effectAllowed = "move"//为需要移动的元素设置dragstart事件
      if(item === this.dragging){
        return
      }
      const newItems = [...this.Pics]

      const src = newItems.indexOf(this.dragging)
      const dest = newItems.indexOf(item)
      newItems.splice(dest, 0, ...newItems.splice(src, 1))

      this.Pics = newItems
    },
    deletePic(index) {
      this.Pics.splice(index,1)
    },
    handleChange(file, fileList, event){
      const {status, response, name} = file.file
      console.log(123, status, file)
      if (status === 'done') {
        if(response.IsSuccess){
          this.Pics.push(response.Data.Url)
        }else{
          tipMessage(response.Msg)
        }
      }else if(status === 'error'){
        tipMessage(`${name} 上传失败`)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.moments-tbDetail{
  min-width: 900px;
  .h2{
    text-align: center;
    padding-top: 10px;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: bold;
  }
  .h3{
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: bold;
  }
  .g-btn{
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .piclist{
    .pic-item{
      width: 100px;
      height: 100px;
      float: left;
      margin-right: 10px;
      cursor: pointer;
      list-style: none;
      border: 1px solid #ccc;
      text-align: center;
      margin-bottom: 10px;
      position: relative;
      .close-layer{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 0;
        overflow: hidden;
        transition: height .1s;
        background:  rgba(0,0,0,0.6);
        .icon-delete{
          display: block;
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px;
          color: #fff;
        }
      }
      &:hover{
        .close-layer{
            height: 30px;
        }
      }
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .pic-btn{
      float: left;
    }
  }
}
</style>


