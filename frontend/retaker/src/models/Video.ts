export class Video {
	id?: string
	fps: number
	name: string
	url: string
	thumbnail_url: string

	constructor(fps: number, name: string, url: string, thumbnail_url: string, id?: string) {
		this.id = id
		this.fps = fps
		this.name = name
		this.url = url
		this.thumbnail_url = thumbnail_url
	}

	isEqual(video: Video): boolean {
		return (
			video.fps === this.fps &&
			video.name === this.name &&
			video.url === this.url &&
			video.thumbnail_url === this.thumbnail_url
		)
	}
}
