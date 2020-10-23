<template>
  <div class="ddConfig">
    <a-row :gutter="10">
      <a-col :span="12">
        <h3 class="left-h3">拼多多有券文案：</h3>
        <a-textarea
          ref="CouponsText"
          @focus="textfoc('CouponsText')"
          v-model="con.CouponsText"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="12">
        <h3 class="left-h3">拼多多无券文案：</h3>
        <a-textarea
          ref="NoCouponsText"
          @focus="textfoc('NoCouponsText')"
          v-model="con.NoCouponsText"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <a-button class="g-btn" type="primary" @click="insertText('#商品标题#')">商品标题</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#推荐文案#')">推荐文案</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#短链接#')">短链接</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#原价#')">原价</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#券后价#')">券后价</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#券值#')">券值</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#月销量#')">月销量</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#随机表情#')">随机表情</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#自定义变量#')">自定义变量</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#APP邀请码#')">APP邀请码</a-button>
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <h3 class="left-h3">发朋友圈配置</h3>
        <div style="margin-bottom: 10px">（1）朋友圈评论区第一条评论配置，最多可设置4个模板，发圈时每个代理将随机取其中的一个配置样式使用</div>
      </a-col>
      <a-col :span="6">
        模板一：<a-switch v-model="con.IsOpenITemplateOne" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="ITemplateOne"
          @focus="textfoc('ITemplateOne')"
          v-model="con.ITemplateOne"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="6">
        模板二：<a-switch v-model="con.IsOpenITemplateTwo" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="ITemplateTwo"
          @focus="textfoc('ITemplateTwo')"
          v-model="con.ITemplateTwo"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="6">
        模板三：<a-switch v-model="con.IsOpenITemplateThree" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="ITemplateThree"
          @focus="textfoc('ITemplateThree')"
          v-model="con.ITemplateThree"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="6">
        模板四：<a-switch v-model="con.IsOpenITemplateFour" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="ITemplateFour"
          @focus="textfoc('ITemplateFour')"
          v-model="con.ITemplateFour"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <a-button class="g-btn" type="primary" @click="insertText('#券后价#')">券后价</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#券值#')">券值</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#短链接#')">短链接</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#随机表情#')">随机表情</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#原价#')">原价</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#APP邀请码#')">APP邀请码</a-button>
      </a-col>
      <a-col :span="24">
        <div style="margin-bottom: 10px">（2）朋友圈评论区第二条评论配置，最多可设置4个模板，发圈时每个代理将随机取其中的一个配置样式使用</div>
      </a-col>
      <a-col :span="6">
        模板一：<a-switch v-model="con.IsOpenIITemplateOne" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="IITemplateOne"
          @focus="textfoc('IITemplateOne')"
          v-model="con.IITemplateOne"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="6">
        模板二：<a-switch v-model="con.IsOpenIITemplateTwo" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="IITemplateTwo"
          @focus="textfoc('IITemplateTwo')"
          v-model="con.IITemplateTwo"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="6">
        模板三：<a-switch v-model="con.IsOpenIITemplateThree" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="IITemplateThree"
          @focus="textfoc('IITemplateThree')"
          v-model="con.IITemplateThree"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="6">
        模板四：<a-switch v-model="con.IsOpenIITemplateFour" checked-children="开" un-checked-children="关" />&ensp;启用
        <a-textarea 
          ref="IITemplateFour"
          @focus="textfoc('IITemplateFour')"
          v-model="con.IITemplateFour"
          style="margin-top: 5px"
          :autosize="{ minRows: 6, maxRows: 6 }" 
        />
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <a-button class="g-btn" type="primary" @click="insertText('#券后价#')">券后价</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#券值#')">券值</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#短链接#')">短链接</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#随机表情#')">随机表情</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#原价#')">原价</a-button>
        <a-button class="g-btn" type="primary" @click="insertText('#APP邀请码#')">APP邀请码</a-button>
      </a-col>
      <a-col :span="24" style="margin-top: 20px;height: 40px;">
        <a-button type="primary" style="width: 120px" :disabled="saveDisabled" @click="saveDdConfig">保存</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { pddconfig, savePddconfig } from '@/api/tk/userConfigApi.js'
export default {
  name: 'ddConfig',
  data() {
    return {
      con: {
        CouponsText: '',
        NoCouponsText: '',
        IsOpenITemplateOne: false,
        ITemplateOne: '',
        IsOpenITemplateTwo: false,
        ITemplateTwo: '',
        IsOpenITemplateThree: false,
        ITemplateThree: '',
        IsOpenITemplateFour: false,
        ITemplateFour: '',
        IsOpenIITemplateOne: false,
        IITemplateOne: '',
        IsOpenIITemplateTwo: false,
        IITemplateTwo: '',
        IsOpenIITemplateThree: false,
        IITemplateThree: '',
        IsOpenIITemplateFour: false,
        IITemplateFour: '',
      },
      selectRefText: 'CouponsText',
      saveDisabled: true,
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      pddconfig().then(res => {
        this.con = res.Data
        this.saveDisabled = false
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
        this.$message.error('插入错误：' + error)
      }
    },
    saveDdConfig(){
      if(!this.con.Id) return this.$message.warning('请先获取多多进宝联盟配置')
      savePddconfig(this.con).then(res => {
        this.$message.success('保存成功')
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.ddConfig{
  min-width: 700px;
  padding: 5px;
  .t-tips{
    font-size: 12px;
    color: #faad14;
    font-weight: normal;
  }
  .g-btn{
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>


