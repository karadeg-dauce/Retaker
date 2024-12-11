<template>
	<div class="container">
		<div v-for="media in listVideos">
			<VideoCard :video="media"></VideoCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import VideoCard from '@/components/VideoCard.vue'

const listVideos = ref([])

/**
 * Fetch all videos metadata
 */
async function fetchVideos() {
	const response = await api.get('/videos-metadata')
	return response.data // [{ name: 'video.mp4', url: '/uploads/video.mp4' }]
}

onMounted(async () => {
	listVideos.value = await fetchVideos()
})
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;

	padding: var(--high-spacing) var(--huge-spacing);
}
</style>
