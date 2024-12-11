import { createRouter, createWebHistory } from 'vue-router'
import Timeline from '@/components/Timeline.vue'
import ListMedia from '@/components/ListMedia.vue'
import UploadVideo from '@/components/UploadVideo.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: ListMedia,
		},
		{
			path: '/player/:id',
			name: 'player',
			component: Timeline,
		},
		{
			path: '/upload',
			name: 'UploadVideo',
			component: UploadVideo,
		},
	],
})

export default router
