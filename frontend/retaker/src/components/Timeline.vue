<template>
  <div class="video-player__wrapper" @keyup.space="playOrStop">
    <div class="video-player">
      <DrawingLayer :height="videoHeight" :width="videoWidth"/>
      <video class="video" ref="videoPlayer" :src="videoUrl" @timeupdate="updateTime" @click="playOrStop"></video>
      <div class="timeline">
        <input
          type="range"
          :min="0"
          :max="duration"
          :step="frameDuration"
          v-model="currentTime"
          @input="seek"
        />
        <div class="controls">
          <div class="controls--left">
            <div @click="playOrStop" class="button--icon">
              <i class="material-icons">{{ isPlay ? "pause" : "play_arrow" }}</i>
            </div>
            <div class="button--icon">
              <p>{{displayedCurrentTime}} / {{displayedDuration}}</p>
            </div>
          </div>
          <div class="controls--right">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { convertDuration } from '@/services/utils.ts'
import DrawingLayer from '@/components/DrawingLayer.vue'
import api from '@/services/api.ts'

const videoUrl = ref("/test.mp4");
const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoHeight = ref(0);
const videoWidth = ref(0);
const fps = ref(30); // Valeur par défaut, mise à jour après analyse.

const duration = ref(100); // Durée totale en secondes (à ajuster plus tard)
const displayedDuration = ref('');
const displayedCurrentTime = ref('0:00');
const currentTime = ref(0);
const frameDuration = ref(0.1)
const isPlay = ref(false);

onMounted(() => {

})

async function fetchVideos() {
  const response = await api.get(`/videos/${videoUrl.value}`);
  return response.data; // [{ name: 'video.mp4', url: '/uploads/video.mp4' }]
}

/**
 * Update the currentTime and the dispayedCurrentTime
 */
function updateTime() {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime;
    displayedCurrentTime.value = convertDuration(videoPlayer.value.currentTime);
  }
}

/**
 * Play or Stop the video
 */
function playOrStop() {
  if (isPlay.value && videoPlayer.value) {
    videoPlayer.value.pause();
  } else if (videoPlayer.value && !isPlay.value) {
    videoPlayer.value.play();
  }
  isPlay.value = !isPlay.value;
}

/**
 * Set the current time of the video to the current time value
 */
function seek() {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = currentTime.value;
  }
}

// Charger la durée totale de la vidéo
watch(videoPlayer, (player) => {
  if (player) {
    player.onloadedmetadata = () => {
      duration.value = player.duration;
      displayedDuration.value = convertDuration(player.duration);
      videoHeight.value = player.videoHeight;
      videoWidth.value = player.videoWidth;

      // Gestion des touches
      document.addEventListener('keydown', (event) => {
        if (!videoPlayer.value) return;

        const frameDuration = 1 / fps.value; // Durée d'une frame en secondes

        console.log(event.key);

        if (event.key === 'ArrowRight') {
          videoPlayer.value.currentTime = Math.min(
            videoPlayer.value.currentTime + frameDuration,
            videoPlayer.value.duration
          );
        } else if (event.key === 'ArrowLeft') {
          videoPlayer.value.currentTime = Math.max(
            videoPlayer.value.currentTime - frameDuration,
            0
          );
        }
      });
    };
  }
});
</script>

<style scoped>
  .video-player__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .video-player {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      position: relative;
      .video {
        width: fit-content;
        pointer-events: none;
      }
    }
  }

  .timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    input {
      width: 100%;
      padding: 20px 0 ;
    }
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    width: 100%;

    .controls--left {
      display: flex;
      flex-direction: row;
    }
  }
</style>
