<template>
	<div>
		<canvas
			ref="canvas"
			:width="width"
			:height="height"
			@mousedown="startDrawing"
			@mousemove="draw"
			@mouseup="stopDrawing"
		></canvas>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	height: Number,
	width: Number,
})

const canvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const context = ref<CanvasRenderingContext2D | null>(null)

/**
 * init canvas for drawing and set isDrawing to true
 * @param event MouseEvent
 */
function startDrawing(event: MouseEvent) {
	if (canvas.value) {
		isDrawing.value = true
		context.value = canvas.value.getContext('2d')
		context.value!.beginPath()
		context.value!.moveTo(event.offsetX, event.offsetY)
	}
}

/**
 * draw a line between two point
 * @param event MouseEvent
 */
function draw(event: MouseEvent) {
	if (isDrawing.value && context.value) {
		context.value.lineTo(event.offsetX, event.offsetY)
		context.value.stroke()
	}
}

/**
 * Set isDrawing to false
 */
function stopDrawing() {
	isDrawing.value = false
}
</script>

<style scoped>
canvas {
	position: absolute;
	left: 0;
	pointer-events: all;
}
</style>
