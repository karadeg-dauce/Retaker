<template>
	<div class="header">
		<router-link to="/">
			<h1 class="title">Retaker</h1>
		</router-link>
		<div class="actions--right">
			<div class="button--icon">
				<router-link to="/upload">
					<i class="material-icons">upload</i>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const uploadStatus = ref<string | null>(null)

const message = ref('')

async function testBackend() {
	try {
		const response = await api.get('/ping')
		message.value = response.data.message
	} catch (error) {
		console.error(error)
		message.value = 'Error connecting to backend'
	}
}

async function importMedia(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0]
	if (!file) return

	const formData = new FormData()
	formData.append('file', file)

	try {
		const response = await api.post('/upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		uploadStatus.value = 'Upload successful: ' + response.data.path
	} catch (error) {
		console.error(error)
		uploadStatus.value = 'Upload failed'
	}
}
</script>

<style scoped>
.header {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: var(--low-spacing) var(--huge-spacing);

	.actions--right {
		display: flex;
		flex-direction: row;

		> * {
			margin-left: var(--low-spacing);
		}
	}
}
</style>
