<template>
    <div class="add-edit-temp">
        <a-card title="模板名称">
            <a-form :form="form">
                <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="模板名称"
                >
                <a-input
                    v-decorator="[
                    'TemplateName',
                    { rules: [{ required: true, message: '请输入模板名称' }] },
                    ]"
                    placeholder="接粉入群（群名称）"
                />
                </a-form-item>
                <a-form-item
                    :label-col="formItemContent.labelCol"
                    :wrapper-col="formItemContent.wrapperCol"
                    label="内容"
                    >
                    <div v-if="pageStatusType == 1">
                        <div v-if="newAddGroupCall.length" class="more-content">
                            <a-form-item v-for="(item, index) in newAddGroupCall" :key="index">
                                <a-input
                                    v-model="item.textContent"
                                    placeholder="内容 1"
                                />
                                <div class="operate-btn">
                                    <span>修改</span>
                                    <span>删除</span>
                                </div>
                            </a-form-item>
                        </div>
                        <div v-if="newAddPictureFile.length" class="upload-file">                            
                            <a-form-item v-for="(item, index) in newAddPictureFile" :key="index">
                                <!-- <a-input
                                    v-model="item.picture"
                                    placeholder="内容 1"
                                /> -->
                                <div><img :src="item.picture" alt="" style="height: 180px"></div>
                            </a-form-item>
                            <div class="operate-btn">
                                <span>修改</span>
                                <span>删除</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="pageStatusType == 2">
                        <div v-for="(item, index) in modeDataForm" :key="index" class="more-content">
                            <a-form-item>
                                <a-input
                                    v-model="item.groupCall"
                                    placeholder="内容 1"
                                />
                                <div class="operate-btn">
                                    <span>修改</span>
                                    <span>删除</span>
                                </div>
                            </a-form-item>
                            <a-form-item>
                                <a-input
                                    v-model="item.groupName"
                                    placeholder="群名称 1"
                                />
                                <div class="operate-btn">
                                    <span>修改</span>
                                    <span>删除</span>
                                </div>
                            </a-form-item>
                            <!-- <a-form-item>
                                <a-input
                                    v-model="item.picture"
                                    placeholder="图片 1"
                                />
                                <div class="operate-btn">
                                    <span>修改</span>
                                    <span>删除</span>
                                </div>
                            </a-form-item> -->
                            
                        </div>
                    </div>
                    <!-- <a-input
                        v-decorator="[
                        'nickname',
                        { rules: [{ required: true, message: '请输入内容 1' }] },
                        ]"
                        placeholder="内容 1"
                    /> -->
                    <div class="btn-box">
                        <span v-for="(item, index) in addBtnList" :key="index" :data-btnIndex="index" @click="clickAddBtn" class="add-btn">
                            {{item.text}}
                        </span>
                    </div>
                </a-form-item>
                <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="备注"
                >
                <a-input
                    v-decorator="[
                    'Remarks',
                    { rules: [{ required: false, message: '' }] },
                    ]"
                    placeholder="备注"
                />
                </a-form-item>
                <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
                <!-- <a-form-item> -->
                <a-button type="primary" @click="check">
                    确定
                </a-button>
                </a-form-item>
            </a-form>
            <!-- 弹窗 -->
            <a-modal v-model="textVisible" title="请输入文本" :footer="null" @ok="hideModal" wrapClassName="dialog-temp-edit" style="wdith: 420px">
                <!-- <a-input v-model="textContent" class="text-content">
                </a-input> -->
                <div v-if="MessageType == 0">
                    <a-textarea v-model="textContent" placeholder="文本域" :rows="4" class="text-content" />
                    <div class="text-btn">
                        <a-button @click="insertText('免单口令')">免单口令</a-button>
                        <a-button @click="insertText('@入群新人')">@入群新人</a-button>
                        <a-button @click="insertText('邀请码')">邀请码</a-button>
                    </div>
                </div>
                <div v-if="MessageType == 1">
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :customRequest="upLoadImage"
                        :before-upload="beforeUpload"
                    >
                    <!-- 
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        @change="handleChange" -->
                        <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>
                        <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                        </div>
                    </a-upload>
                </div>
                <div class="subBtn">
                    <a-button @click="clickCancel">取消</a-button>
                    <a-button type="primary" @click="clickSure">确定</a-button>
                </div>
            </a-modal>
        </a-card>
    </div>
</template>
<script>
import { CreatePushMessageTemplate, } from '@/api/tk/templateManagement.js'
import tipMessage from '@/utils/messageUtil.js'
import axios from 'axios'


const formItemLayout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 4 },
};
const formItemContent = {
  labelCol: { span: 1 },
  wrapperCol: { span: 8 },
};
// 按钮
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
    //   新增过来   1   编辑过来   2
      pageStatusType: 1,
    //   checkNick: false,
      formItemLayout,
      formItemContent,
      formTailLayout,
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      newForm: {},
      addEditStatusType: 0,//0新增，1删除， 2修改
      addBtnList: [
        { text: '文本' },
        { text: '图片' },
        { text: '音频' },
        { text: '视频' },
        { text: '群邀请' }
      ],
    //   新增的form
    //   newAddForm: [
    //       {
              newAddGroupCall: [
                //   { textContent: '1230000' },
                //   { textContent: '1111111000000000' },
              ],
              newAddGroupName: [
                  { name: '' }
              ],
              newAddPictureFile: [
                //   {
                //       picture: ''
                //   }
              ],
              newAddVoiceFile: [
                  {
                      voice: ''
                  }
              ],
              newAddVideoFile: [
                  {
                      video: ''
                  }
              ],
    //       }
    //   ],
    //   编辑 form
      modeDataForm: [
        {
            groupCall: 'hello',//群招呼
            groupName: 'qunn',
            picture: ''
        }
      ],
      fixData: {
          TemplateType:3,
          CreateType:3
      },
      updateId: 0,//创建0，修改id，删除id Id
    //   updateSort: '',//创建，修改，删除Sort
      MessageContent: '',//消息内容
      textContent: '',
    //   uploadFileContent: '',
      MessageType:0,//消息类型 0文本 1图片 3音频 4视频 5群邀请	int
      moreDataArr: [
        //   {
        //       Id:0,//新增的时候默认0，编辑或者删除的是必传，根据列表获取	
        //       Opt:0,//操作类型 0新增 1删除 2修改
        //       Sort:1,// int
        //       MessageContent:'测试消息2',//消息内容	
        //       MessageType:0//消息类型 0文本 1图片 3音频 4视频 5群邀请	int
        //     }
        ],
    //  文本
    // 图片
      loading: false,
      imageUrl: '',
      textVisible: false,
    };
  },
  methods: {
    check() {
      this.form.validateFields((err, value) => {
          this.newForm = value
          console.log('88----', value)
        if (!err) {
          console.info('success');
        }
      });             
      const params = {...this.newForm,...this.fixData,...{Id: this.updateId},...{PushMessageTemplateDetail:this.moreDataArr}}
      CreatePushMessageTemplate(params).then(res => {
          console.log('ti---jiao---', res)
      })
    },
    // 点击添加dom按钮
    clickAddBtn(e) {
        this.textVisible = true
        var num = e.target.dataset.btnindex
        if(num == 0) {
            this.MessageType = 0
        } else if(num == 1) {
            this.MessageType = 1
        } else if(num == 2) {
            this.MessageType = 3
        } else if(num == 3) {
            this.MessageType = 4
        } else if(num == 4) {
            this.MessageType = 5
        }
        // 点击文本，图片，音频，视频，群邀请时
        if(this.MessageType >= 1 || this.MessageType <= 5) {
            this.updateId = 0
            // 设置点击 删除时 updateId 为1 ，设置点击 修改时 updateId 为2
        }
        console.log('add--', e.target.dataset.btnindex)
    },
    // 弹窗新增文本
    clickSure() {
        // 新增
        //文本
        var addContent
        if(this.MessageType == 0) {
            addContent = this.textContent
        } else if(this.MessageType == 1 || this.MessageType == 2 || this.MessageType == 3) {
            addContent = this.imageUrl
        }
        var textObj = {
              Id: this.updateId,//新增的时候默认0，编辑或者删除的是必传，根据列表获取	
              Opt: 0,//操作类型 0新增 1删除 2修改
              Sort: Math.floor(Math.random(1,10)*10),// int  new Date().getTime()  
              MessageContent: this.imageUrl,//this.textContent消息内容	路径地址
              MessageType: this.MessageType//消息类型 0文本 1图片 3音频 4视频 5群邀请	int
           }
        this.moreDataArr.push(textObj)
        // 新增文本[]
        var newTextObj
        if(this.MessageType == 0) {
            newTextObj = {textContent: this.textContent}
            this.newAddGroupCall.push(newTextObj)
        } else if(this.MessageType == 1 || this.MessageType == 2 || this.MessageType == 3) {
            newTextObj = { picture: this.imageUrl }
            this.newAddPictureFile.push(newTextObj)
        }
        // console.log('666---------', this.newAddGroupCall)
        console.log('img---------', this.newAddPictureFile)
        this.textVisible = false
        console.log('确定', this.moreDataArr)
    },
    clickCancel() {
        this.textVisible = false
        console.log('取消')
    },
    hideModal() {
        this.textVisible = false
    },
    // 图片
    // handleChange(info) {
    //     console.log('handleChange---------------------info---', info)
    //   if (info.file.status === 'uploading') {
    //     this.loading = true;
    //     return;
    //   }
    //   if (info.file.status === 'done') {
    //     // Get this url from response in real world.
    //     getBase64(info.file.originFileObj, imageUrl => {
    //       this.imageUrl = imageUrl;
    //       this.loading = false;
    //     });
    //   }
    // },
    upLoadImage(file) {
        console.log('自定义---------', file)
        const formData = new window.FormData()
        formData.append('Files', file.file)
        console.log('formData----------', formData)
        axios({
            method: 'post',
            // url: '/api/UploadFile/UploadFile',
            url: '/api/UploadFile/UploadImage',
            data: formData,
            headers: {
            'Content-Type': 'multipart/form-data',
            // 'token': this.token
            }
        }).then(res => {
            console.log('res--------img-------res--------', res)
            this.imageUrl = res.data.Msg
            // if (file) {
            // file.onSuccess(res)
            // }
            // this.detailData.imgUrl = res.data.result
        }).catch((err) => {
            file.onError(err)
        })
    },
    beforeUpload(file) {
        console.log('beforeUpload----------------file---', file)
    //   const isJpgOrPng = file.type === 'video/mp4';
    //   const isJpgOrPng = file.type === 'audio/mpeg';
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>
<style lang="scss">
.add-edit-temp{
    .ant-form-item{
        .ant-col-1{
            width: 5%;
        }
        .btn-box{
            .add-btn{
                display: inline-block;
                width: 60px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                font-size: 14px;
                border: 1px solid;
                border-radius: 3px;
                margin-right: 8px;
                cursor: pointer;
            }
        }
    }
    .more-content{
        .ant-form-item-children{
            display: flex;
            .operate-btn{
                width: 160px;
                span{
                    text-decoration: underline;
                    margin-left: 20px;
                    color: rgba(24, 144, 255, 1);
                }
            }
        }
    }
    .upload-file{
        display: flex;
        width: 600px;
        height: 200px;
        padding: 5px 10px;
        .operate-btn{
            margin: 80px 0 0 20px;
            span{
                text-decoration: underline;
                color: rgba(24, 144, 255, 1);
                margin-left: 10px;
            }
        }
    }
}
.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
    }
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.dialog-temp-edit{
    .ant-modal{
        width: 420px !important;
    }
    .ant-modal-header{
        text-align: center;
        border-bottom: 0;
        .ant-modal-title{
            font-size: 18px;
            font-weight: bold;
        }
    }
    .text-content{
        // width: 100%;
        // height: 160px;
        // border: 1px solid;
        margin-bottom: 10px;
    }
    .text-btn{
        .ant-btn{
            margin-right: 10px;
        }
    }
    .subBtn{
        width: 45%;
        margin: 40px auto 20px;
        display: flex;
        justify-content: space-between;
    }
}
</style>
<style lang="scss" scoped>
.add-edit-temp{

}
</style>