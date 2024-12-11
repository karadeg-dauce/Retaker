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
import {generateUniqueFilename} from "../src/services/file_handling.js";

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

router.get('/ping', async () => {
  return {message: 'Backend is working!'};
});

/**
 * Upload a video to the upload directory, thumbnail to thumbnails directory and save metadata into db
 */
router.post('/upload', async ({request, response}) => {
  const payload = request.only(['name', 'description', 'author']);
  const thumbnail = request.file('thumbnail')
  const file = request.file('file', {
    extnames: ['mp4', 'gif'],
    size: '100mb',
  })

  // If not video, send invalid request
  if (!file) {
    return response.badRequest('Invalid file');
  }

  // Handle thumbnail save in backends
  const thumbnailName: string = generateUniqueFilename(thumbnail?.clientName)
  if (thumbnail) {
    await thumbnail.move('./uploads/thumbnails', {name: thumbnailName});
  }

  // Handle the save of the video
  const videoName = generateUniqueFilename(payload.name)
  await file.move('./uploads/videos', {name: videoName});

  // Retrieve fps
  let fps: { value: number } = {value: 30};
  try {
    fps = await getVideoMetadata(`./uploads/${videoName}`)
  } catch (error) {
    return response.status(500).send({error: error.message});
  }

  // Create an instance of video in the db
  const newVideo = await Video.create({
    name: payload.name,
    description: payload.description,
    author: payload.author,
    url: `./uploads/videos/${videoName}`,
    fps: fps.value,
    thumbnail_url: `./uploads/thumbnails/${thumbnailName}`,
  })

  return response.json(newVideo)
})

/**
 * Get all videos metadata in db
 */
router.get('/videos-metadata', async ({response}) => {
  const videosMetadata = await Video.all()

  return response.json(videosMetadata);
});

/**
 * Get video metadata in db for a specific filename
 */
router.get('/video-metadata/:id', async ({params, response}) => {
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
router.get('/video/:filename', async ({params, response}) => {
  try {
    // Rechercher la vidéo en base de données par son nom de fichier
    const video = await Video.findBy('url', `./uploads/videos/${params.filename}`)

    if (!video) {
      return response.notFound('Vidéo non trouvée')
    }

    // Préparer la réponse avec les données de la vidéo et le chemin de la miniature
    return response.json(video)
  } catch (error) {
    console.error('Erreur de récupération de la vidéo:', error)
    return response.status(500).send({
      message: 'Erreur lors de la récupération de la vidéo',
      error: error.message,
    })
  }
})

router.get('/videoThumbnail/:id', async ({params, response}) => {
  try {
    const video = await Video.findBy('id', params.id)

    if (!video) {
      return response.notFound('Miniature non trouvée')
    }

    // Renvoie le fichier de la miniature
    return response.download(video.thumbnail_url)
  } catch (error) {
    console.error('Erreur de récupération de la miniature:', error)
    return response.status(500).send({
      message: 'Erreur lors de la récupération de la miniature',
      error: error.message,
    })
  }
})

/**
 * Retrieve the fps of a video placed at the following filePath
 * @param filePath string
 */
export async function getVideoMetadata(filePath: string): Promise<{ value: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const fps = metadata.streams[0].r_frame_rate; // Exemple pour récupérer le FPS
      const value = Number(fps.split('/')[0]);
      resolve({value});
    });
  });
}
