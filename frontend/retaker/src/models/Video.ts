export class Video {
  id?: string;
  fps: number;
  name: string;
  url: string;

  constructor(fps: number, name: string, url: string, id?: string, ) {
    this.id = id;
    this.fps = fps;
    this.name = name;
    this.url = url;
  }

  isEqual(video: Video): boolean {
    return video.fps === this.fps && video.name === this.name && video.url === this.url;
  }
}
