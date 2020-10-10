<template>
  <div class="groupConfig">
    <a-card title="群发配置">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="全局配置" style="overflow-x: auto">
          <all-config></all-config>
        </a-tab-pane>
        <a-tab-pane key="2" tab="淘宝联盟配置">
          
        </a-tab-pane>
        <a-tab-pane key="3" tab="多多进宝（拼多多）联盟配置">
          
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import AllConfig from './allConfig.vue'
export default {
  name: 'groupConfig',
  components: {
    AllConfig,
  },
  created() {
    
  },
  methods: {
    
  },
  filters: {

  }
}
</script>


<style lang="scss" scoped>
.groupConfig{

}
</style>

