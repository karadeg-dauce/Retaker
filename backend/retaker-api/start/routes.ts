/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import ffmpeg from 'fluent-ffmpeg';
import app from '@adonisjs/core/services/app'
import Video from '#models/video'

router.get('/ping', async () => {
  return { message: 'Backend is working!' };
});

/**
 * Upload a video to the upload directory, thumbnail to thumbnails directory and save metadata into db
 */
router.post('/upload', async ({ request, response }) => {
  const payload = request.only(['name', 'description', 'author']);
  const thumbnail = request.file('thumbnail');
  const file = request.file('file', {
    extnames: ['mp4', 'gif'],
    size: '100mb',
  });

  // If not video, send invalid request
  if (!file) {
    return response.badRequest('Invalid file');
  }

  // Handle thumbnail save in backends
  const thumbnailName: string = thumbnail
    ? `${new Date().getTime()}_${thumbnail.clientName}`
    : `${new Date().getTime()}_default`;
  if (thumbnail) {
    await thumbnail.move('./thumbnails', { name: thumbnailName });
  }

  // Handle the save of the video
  const videoName = `${new Date().getTime()}_${file.fileName}`;
  await file.move('./uploads', { name: videoName });

  // Retrieve fps
  let fps = 30;
  try {
    fps = await getVideoMetadata(`./uploads${videoName}`);
  }
  catch (error) {
    return response.status(500).send({error: error.message});
  }

  // Create an instance of video in the db
  const newVideo = await Video.create({
    name: payload.name,
    description: payload.description,
    author: payload.author,
    url: `/uploads/${videoName}`,
    fps: fps,
    thumbnail_url: `/thumbnails/${thumbnailName}`,
  });


  return response.json(newVideo);
});

/**
 * Get all videos metadata in db
 */
router.get('/videos-metadata', async ({ response }) => {
  const videosMetadata = await Video.all()

  return response.json(videosMetadata);
});

/**
 * Get video metadata in db for a specific filename
 */
router.get('/video-metadata/:id', async ({ params, response }) => {
  const videoMetadata = await Video.query().where('id', params.id);
  if (videoMetadata) {
    return response.status(404).send({error: 'Not found'});
  } else {
  return response.json(videoMetadata[0]);
  }
});

/**
 * Return the video with the specific filename
 */
router.get('/video/:filename', async ({ params, response }) => {
  const filePath = app.makePath(`uploads/${params.filename}`);
  return response.download(filePath);
});

/**
 * Retrieve the fps of a video placed at the following filePath
 * @param filePath string
 */
export async function getVideoMetadata(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const fps = metadata.streams[0].r_frame_rate; // Exemple pour récupérer le FPS
      const fpsParsed = Number(fps.split('/')[0]);
      resolve({ fpsParsed });
    });
  });
}
