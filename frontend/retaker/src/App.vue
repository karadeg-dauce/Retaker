<script setup lang="ts">
  import Header from '@/components/Header.vue'
</script>

<template>
  <div class="container">
    <Header />
    <RouterView />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
}
</style>
