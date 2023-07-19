import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;

  try {
    const filePath = path.join(process.cwd(), 'public', 'pfps', file);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if(err.code === 'ENOENT') {
          res.status(404).json({ error: 'File not found' });
          return;
        } else {
        res.status(500).json({ error: 'Failed to read file' });
        return;
        }
      } else {
        res.status(200).send(data);
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
}
