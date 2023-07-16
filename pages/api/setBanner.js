import { setUserBanner } from '@/utils/api';
import { ironOptions } from '@/utils/ironConfig';
import fs from 'fs';
import { withIronSessionApiRoute } from 'iron-session/next';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
export default withIronSessionApiRoute(handler, ironOptions)

// Create a multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'banners'));
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    const fileName = `${id}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

// Create a multer instance with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize:5 * 1024 * 1024 }, // Limit the file size to 5MB
});

function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  if (!req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      // Multer error occurred during file upload
      console.log(error);
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File size exceeds the limit of 5MB.' });
      } else {
        res.status(500).json({ error: 'Failed to upload the file.' });
      }
    } else if (error) {
      console.log(error);
      // Other error occurred during file upload
      res.status(500).json({ error: 'Failed to upload the file.' });
    } else {
      // File upload successful
      const file = req.file;

      if (!file) {
        // Set to gravatar
        res.status(400).json({ error: 'No file was uploaded.' });
        return;
      }

      // Save to database
      setUserBanner(req.session.user.id, file.filename)
        .then(() => {
          res.status(200).json({ id: file.filename });
        })
        .catch((e) => {
          res.status(500).json({ error: 'Failed to set your Banner.' });
        });
    }
  });
}

export const config = {
  api: {
    bodyParser: false
  }
}