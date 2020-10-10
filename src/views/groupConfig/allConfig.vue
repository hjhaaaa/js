<template>
  <div class="allConfig">
    <a-row>
      <a-col :span="8">
        <h3 class="left-h3">发送时间设置</h3>
        <div>
          发圈间隔（分）
          <a-input-group compact class="all-con-group">
            <a-button @click="reduceTime">-</a-button>
            <a-input style="width: 60px;text-align: center" v-model="conData.SendQuanInterval"/>
            <a-button @click="addTime">+</a-button>
          </a-input-group>
        </div>
      </a-col>
      <a-col :span="16">
        <h3 class="left-h3">微信绑定口令设置</h3>
        <a-col :span="12">新增发单微信群密令：<span style="font-weight: bold">绑定</span></a-col>
        <a-col :span="12">新增采集微信群密令：<span style="font-weight: bold">绑定采集</span></a-col>
        <a-col :span="12">新增群回复内容：<span style="font-weight: bold">绑定成功</span></a-col>
        <a-col :span="12">新增群回复内容：<span style="font-weight: bold">绑定成功</span></a-col>
        <a-col :span="24" style="margin-top: 10px">
          提示：<br/>1.请代理在发单微信群发送新增群密令绑定发单群，其他控制操作请在代理管理页面操作哦<br/>
          2.采集群密令使用方法：采集器页面登陆的微信在需要采集的群里发送：密令@采集人 绑定采集群操作
        </a-col>
      </a-col>
      <a-col :span="24" style="margin-top: 10px">
        <h3 class="left-h3">微信绑定口令设置</h3>
        <div>
          <a-input-group compact class="all-con-group">
            <a-button disabled>触发词</a-button>
            <a-input style="width: 160px" v-model="tjForm.Keyword" placeholder="请输入内容"/>
          </a-input-group>
          <a-input-group compact class="all-con-group">
            <a-button disabled>规则</a-button>
            <a-select style="width: 110px" v-model="tjForm.FiterType" placeholder="请选择">
              <a-select-option :value="1">替换成</a-select-option>
              <a-select-option :value="2">该条不要</a-select-option>
            </a-select>
          </a-input-group>
          <a-input v-model="tjForm.Replacement" style="width: 160px;vertical-align: middle;margin-right: 10px" placeholder="替换后的内容"></a-input>
          <a-button @click="addTj" type="primary" style="vertical-align: middle;">新增条件</a-button>
        </div>
        <div style="margin-top: 8px" v-for="(item, index) in conData.FilterList" :key="index">
          <a-input-group compact class="all-con-group">
            <a-button disabled>触发词</a-button>
            <a-input style="width: 160px" v-model="item.Keyword" disabled placeholder="请输入内容"/>
          </a-input-group>
          <a-input-group compact class="all-con-group">
            <a-button disabled>规则</a-button>
            <a-select style="width: 110px" v-model="item.FiterType" disabled placeholder="请选择">
              <a-select-option :value="1">替换成</a-select-option>
              <a-select-option :value="2">该条不要</a-select-option>
            </a-select>
          </a-input-group>
          <a-input v-model="item.Replacement" disabled style="width: 160px;vertical-align: middle;margin-right: 10px"></a-input>
          <a-button @click="deleteTj(item)" type="danger" 
            style="vertical-align: middle;color: #fff;background-color: #ff4d4f;border-color: #ff4d4f;">删除条件</a-button>
        </div>
        <div style="height: 40px;margin-top: 10px">
          <a-button type="primary" @click="saveTime">保存</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { allconfig, saveAllconfig, addfilter, deletefilter } from '@/api/auth.js'
export default {
  name: 'allConfig',
  data() {
    return {
      conData: {
        SendQuanInterval: 0,
        FilterList: []
      },
      numReg: /^\d*$/,
      tjForm: {
        Keyword: '',
        FiterType: '',
        Replacement: '',
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      allconfig().then(res => {
        this.conData = res.Data
      })
    },
    addTime(){
      if(!this.numReg.test(this.conData.SendQuanInterval)){
        this.$message.info('发圈间隔必须为正整数')
        return
      }
      this.conData.SendQuanInterval++
    },
    reduceTime(){
      if(!this.numReg.test(this.conData.SendQuanInterval)){
        this.$message.info('发圈间隔必须为正整数')
        return
      }
      this.conData.SendQuanInterval--
    },
    addTj(){
      if(!this.tjForm.Keyword) return this.$message.info('请输入触发词')
      if(!this.tjForm.FiterType) return this.$message.info('请选择规则')
      if(this.tjForm.FiterType == 1 && !this.tjForm.Replacement) return this.$message.info('请输入替换后的内容')
      addfilter(this.tjForm).then(res => {
        this.$message.success('新增成功')
        this.tjForm = {
          Keyword: '',
          FiterType: '',
          Replacement: '',
        }
        this.getConfig()
      })
    },
    deleteTj(row){
      this.$confirm({
        title: '删除',
        content: `确定要删除吗？`,
        okText: '删除',
        okType: 'danger',
        onOk: () => {
          deletefilter({Id: row.Id}).then(res => {
            this.$message.info('删除成功')
            this.getConfig()
          })
        },
        onCancel: () => {
          this.$message.warning('取消操作')
        }
      })
    },
    saveTime(){
      if(!this.numReg.test(this.conData.SendQuanInterval)){
        this.$message.info('发圈间隔必须为正整数')
        return
      }
      let { Id, SendQuanInterval } = this.conData
      saveAllconfig({ Id, SendQuanInterval }).then(res => {
        this.$message.success('保存成功')
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.allConfig{
  min-width: 700px;
  .all-con-group{
    display: inline-block;
    width: auto;
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>


