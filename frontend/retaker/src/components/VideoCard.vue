<template>
	<div class="video-card">
		<div class="info--left">
			<h3>{{ video.name }}</h3>
			<img :src="video.thumbnail_url" alt="" />
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
