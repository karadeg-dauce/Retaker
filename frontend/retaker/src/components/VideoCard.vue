<template>
	<div class="video-card">
		<div class="info--left">
			<h3>{{ video.name }}</h3>
			<img :src="thumbnails" alt="" width="400px" />
			<p>url : {{ video.url }}</p>
		</div>
		<div class="info--right">
			<router-link :to="'/player/' + video.id">
				<i @click="openVideo" class="material-icons">file_open</i>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import api from '@/services/api'
import { Video } from '@/models/Video'
import { onMounted, ref } from 'vue'

const props = defineProps({
	video: Video,
})
const thumbnails = ref<string | null>('')

/**
 * Fetch the thumbnail for a video
 * @param videoId Number
 */
async function fetchThumbnail(videoId: number) {
	try {
		const response = await api.get(`/videoThumbnail/${videoId}`, {
			responseType: 'blob',
		})

		// Convert blob to base64
		return URL.createObjectURL(response.data)
	} catch (err) {
		console.error(`Failed to fetch thumbnail for video ${videoId}`, err)
		return null
	}
}

onMounted(async () => {
	thumbnails.value = await fetchThumbnail(props.video.id)
})
</script>

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
