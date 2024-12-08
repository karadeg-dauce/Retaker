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
import fs from 'fs'

export async function getVideoMetadata(filePath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const fps = metadata.streams[0].r_frame_rate; // Exemple pour récupérer le FPS
      const duration = metadata.format.duration; // Durée de la vidéo
      resolve({ fps, duration });
    });
  });
}

// Exemple d'utilisation
router.get('/video-metadata/:filename', async ({ params, response }) => {
  const filePath = app.makePath(`uploads/${params.filename}`);
  try {
    const metadata = await getVideoMetadata(filePath);
    return response.json(metadata);
  } catch (error) {
    return response.status(500).send(error.message);
  }
});
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/ping', async () => {
  return { message: 'Backend is working!' };
});

// Rendre les fichiers du dossier 'uploads' accessibles publiquement
router.get('/uploads/:filename', async ({ params, response }) => {
  const filePath = app.makePath(`uploads/${params.filename}`);
  return response.download(filePath);
});


router.post('/upload', async ({ request, response }) => {
  const file = request.file('file', {
    extnames: ['mp4', 'gif'],
    size: '100mb',
  });

  if (!file) {
    return response.badRequest('Invalid file');
  }

  await file.move('./uploads');
  return { path: `/uploads/${file.fileName}` };
});

router.get('/videos', async ({ response }) => {
  const directory = app.makePath('uploads');
  const files = fs.readdirSync(directory);

  const videos = files.map((file: string) => ({
    name: file,
    url: `/uploads/${file}`,
  }));

  return response.json(videos);
});
