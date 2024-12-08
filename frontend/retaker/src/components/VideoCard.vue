<template>
  <div class="video-card">
    <div class="info--left">
      <h3>{{ video.name }}</h3>
      <p>url : {{ video.url }}</p>
    </div>
    <div class="info--right">
      <i @click="openVideo" class="material-icons">file_open</i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Video } from '@/models/Video.ts'

const props = defineProps({
  video: Video,
})

/**
 * Redirect to the page of the video
 */
function openVideo() {
  console.log('video open')
}
</script>
.video-card {

<style scoped>
.video-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .info--left {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin-right: var(--medium-spacing);
    }
  }

  i {
    cursor: pointer;
  }

  width: auto;

  h3 {
    font-weight: bold;
  }
}
</style>
