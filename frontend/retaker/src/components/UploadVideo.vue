<template>
	<div class="upload-form">
		<!-- Stepper Header -->
		<!--    <div class="stepper">-->
		<!--      <div-->
		<!--        v-for="(step, index) in steps"-->
		<!--        :key="index"-->
		<!--        class="step"-->
		<!--        :class="{ active: index === currentStep }"-->
		<!--      >-->
		<!--        <span class="step-number">{{ index + 1 }}</span>-->
		<!--        <span class="step-label">{{ step.label }}</span>-->
		<!--      </div>-->
		<!--    </div>-->

		<!-- Stepper Content -->
		<form @submit.prevent="submitForm">
			<div v-if="currentStep === 0" class="step-content">
				<h1>Importer votre vidéo</h1>
				<label for="importFile" class="video__label">
					<div class="selector">
						<div class="form-group">
							<i class="material-icons">download</i>
							<p v-if="!uploadStatusVideo">Importer une vidéo</p>
							<input
								id="importFile"
								name="importFile"
								class="field--import"
								type="file"
								@change="handleVideoUpload"
								accept="video/*,image/gif"
							/>
							<p v-if="uploadStatusVideo">{{ uploadStatusVideo }}</p>
						</div>
					</div>
				</label>
			</div>

			<div v-if="currentStep === 1" class="step-content">
				<div class="title">
					<h1>Choisir une miniature</h1>
					<p>
						Vous pouvez sélectionner un moment dans la vidéo pour générer une miniature.
					</p>
				</div>
				<video
					ref="videoPlayer"
					:src="videoPreview"
					controls
					@timeupdate="updateTime"
				></video>
				<canvas ref="canvas" style="display: none"></canvas>
			</div>

			<div v-if="currentStep === 2" class="step-content">
				<h1>Informations Générales</h1>
				<div class="main-info__step">
					<div class="thumbnail">
						<div class="form-group">
							<label for="name">Miniature</label>
							<img
								v-if="thumbnail"
								:src="thumbnail"
								alt="Captured Thumbnail"
								class="thumbnail-preview"
							/>
						</div>
					</div>

					<div class="main-info">
						<div class="form-group">
							<label for="name">Nom de la vidéo</label>
							<input id="name" v-model="form.name" type="text" required />
						</div>

						<div class="form-group">
							<label for="author">Auteur</label>
							<input id="author" v-model="form.author" type="text" required />
						</div>

						<div class="form-group">
							<label for="description">Description</label>
							<textarea id="description" v-model="form.description"></textarea>
						</div>
					</div>
				</div>
			</div>

			<!-- Navigation Buttons -->
			<div class="stepper-navigation">
				<div class="stepper-navigation__left">
					<button
						v-if="currentStep > 0"
						type="button"
						@click="prevStep"
						class="button prev"
					>
						Précédent
					</button>
				</div>
				<div class="stepper-navigation__right">
					<button
						v-if="currentStep === 0"
						type="button"
						@click="nextStep"
						class="button next"
					>
						Suivant
					</button>
					<button type="button" @click="captureThumbnail" v-if="currentStep === 1">
						Capture Thumbnail
					</button>
					<button v-if="currentStep === 2" type="submit" class="button submit">
						Soumettre
					</button>
				</div>
			</div>
		</form>
		<p v-if="uploadStatus">{{ uploadStatus }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

// Étapes du formulaire
const steps = [
	{ label: 'Importer une vidéo' },
	{ label: 'Choisir une miniature' },
	{ label: 'Informations générales' },
]
const currentStep = ref(0)

// Formulaire et fichiers
const form = ref({
	name: '',
	author: '',
	description: '',
})
const videoFile = ref<File | null>(null)
const videoPreview = ref<string | undefined>(undefined)
const thumbnail = ref<string | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0)
const uploadStatus = ref<string | null>(null)
const uploadStatusVideo = ref<string | null>(null)

function handleVideoUpload(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0] || null
	if (file) {
		videoFile.value = file
		videoPreview.value = URL.createObjectURL(file)
		uploadStatusVideo.value = 'Vidéo importée avec succès.'
	} else {
		uploadStatusVideo.value = "Erreur lors de l'importation de la vidéo."
	}

	nextStep()
}

function captureThumbnail() {
	if (!videoPlayer.value || !canvas.value) return

	const ctx = canvas.value.getContext('2d')
	if (ctx) {
		canvas.value.width = videoPlayer.value.videoWidth
		canvas.value.height = videoPlayer.value.videoHeight
		ctx.drawImage(videoPlayer.value, 0, 0, canvas.value.width, canvas.value.height)
		thumbnail.value = canvas.value.toDataURL('image/png')
	}

	nextStep()
}

function updateTime() {
	if (videoPlayer.value) {
		currentTime.value = videoPlayer.value.currentTime
	}
}

function nextStep() {
	if (currentStep.value < steps.length - 1) {
		currentStep.value++
	}
}

function prevStep() {
	if (currentStep.value > 0) {
		currentStep.value--
	}
}

async function submitForm() {
	if (!videoFile.value) {
		uploadStatus.value = 'Veuillez sélectionner une vidéo.'
		return
	}

	const formData = new FormData()
	formData.append('name', form.value.name)
	formData.append('author', form.value.author)
	formData.append('description', form.value.description)
	formData.append('file', videoFile.value)

	if (thumbnail.value) {
		const blob = await fetch(thumbnail.value).then((res) => res.blob())
		formData.append('thumbnail', blob, 'thumbnail.png')
	}

	try {
		const response = await api.post('/upload', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
		uploadStatus.value = 'Upload réussi : ' + response.data.name
	} catch (error) {
		console.error(error)
		uploadStatus.value = "Échec de l'upload. Veuillez réessayer."
	}
}
</script>

<style scoped>
/* Ajout d'un style minimaliste pour le stepper */
.stepper {
	display: flex;
	margin-bottom: 1.5rem;
}

.step {
	flex: 1;
	text-align: center;
	padding: 0.5rem;
	position: relative;
}

.step.active {
	font-weight: bold;
}

.step-number {
	background-color: #007bff;
	color: white;
	border-radius: 50%;
	padding: 0.5rem;
	width: 2rem;
	height: 2rem;
	display: inline-block;
	text-align: center;
}

.step-label {
	margin-top: 0.5rem;
}

.stepper-navigation {
	display: flex;
	justify-content: space-between;
	align-items: center;

	height: 4rem;
}

.upload-form {
	display: flex;
	flex-direction: column;
	justify-content: start;

	flex-grow: 1;

	margin: var(--high-spacing) var(--huge-spacing);

	form {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
}

.step-content {
	display: flex;
	flex-direction: column;
	flex-grow: 1;

	.video__label {
		flex-grow: 1;
		display: flex;

		.selector {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			margin: var(--high-spacing) 0;

			border: 3px dashed #ccc;
			border-radius: var(--medium-spacing);

			cursor: pointer;

			.form-group {
				display: flex;
				flex-direction: row;
				align-items: center;

				i {
					margin-right: var(--low-spacing);
				}
			}

			.field--import {
				display: none;
			}
		}
	}

	video {
		flex-grow: 1;
		width: fit-content;
		height: 290px;
	}

	.main-info__step {
		display: flex;
		flex-direction: row;

		.thumbnail {
			margin-right: var(--high-spacing);
		}

		.form-group {
			display: flex;
			flex-direction: column;

			img {
				height: 300px;
			}
		}
	}
}
</style>
