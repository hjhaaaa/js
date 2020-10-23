<template>
  <layout type="tk">
    <transition name="page-transition">
      <router-view />
    </transition>
  </layout>
</template>

<script>
import Layout from './App/Layout'

export default {
  name: 'AppLayout',
  components: {
    Layout
  }
}
</script>

<style lang="scss" scoped>
  .page-transition-enter {
    opacity: 0;
  }
  
  .page-transition-leave-active {
    opacity: 0;
  }
  
  .page-transition-enter .page-transition-container,
  .page-transition-leave-active .page-transition-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
