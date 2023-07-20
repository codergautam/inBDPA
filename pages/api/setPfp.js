import { setUserPfp } from '@/utils/api';
import { ironOptions } from '@/utils/ironConfig';
import fs from 'fs';
import { withIronSessionApiRoute } from 'iron-session/next';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import sharp from 'sharp';

export default withIronSessionApiRoute(handler, ironOptions);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'pfps'));
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    const fileName = `${id}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit the file size to 2MB
});

function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  if (!fs.existsSync(path.join(process.cwd(), 'public', 'pfps'))) {
    fs.mkdirSync(path.join(process.cwd(), 'public', 'pfps'));
  }

  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      console.log(error);
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds the limit of 2MB.' });
      } else {
        res.status(500).json({ error: 'Failed to upload the file.' });
      }
    } else if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to upload the file.' });
    } else {
      const file = req.file;
      let options = {};

      if (req.body?.crop) {
        try {
          options.crop = JSON.parse(req.body.crop);
          options.zoom = req.body.zoom;
        } catch (e) {
          console.log(e);
        }
      }

      if (!file) {
        setUserPfp(req.session.user.id, 'gravatar')
          .then(() => {
            res.status(200).json({ id: 'gravatar' });
          })
          .catch((e) => {
            res.status(500).json({ error: 'Failed to set your Profile Picture.' });
          });
        return;
      }

      const filePath = path.join(process.cwd(), 'public', 'pfps', file.filename);
      const outputFilePath = path.join(process.cwd(), 'public', 'pfps', `resized_${file.filename}`);

      const image = sharp(filePath);
      // Get the original image width and height
      image
        .metadata()
        .then((metadata) => {
          if (metadata.width < 200 || metadata.height < 200) {
            res.status(400).json({ error: 'Image must be at least 200x200 pixels.' });
            return;
          }
          const origWidth = metadata.width;
          const origHeight = metadata.height;
      if (options.crop) {
        const { x, y, width, height } = options.crop;
        const newHeight = Math.round((height / 100) * origHeight);
        const newWidth = Math.round((width / 100) * origWidth);
        const newX = Math.round((x / 100) * origWidth);
        const newY = Math.round((y / 100) * origHeight);

        image.extract({ left: newX, top: newY, width: newWidth, height: newHeight });
      }

      // Resize to 200x200
      image.resize(200, 200);

      image.toFile(outputFilePath, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to process the image.' });
        } else {
          setUserPfp(req.session.user.id, `resized_${file.filename}`)
            .then(() => {
              res.status(200).json({ id: `resized_${file.filename}` });
            })
            .catch((e) => {
              res.status(500).json({ error: 'Failed to set your Profile Picture.' });
            });
        }
      });
    });
    }
  });
}

export const config = {
  api: {
    bodyParser: false
  }
};
