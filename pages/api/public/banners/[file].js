// pages/api/public/banners/[file].js
// This code is a serverless function for handling requests to retrieve banner images from a specific directory. The function expects a query parameter 'file' to specify the name of the image file to be retrieved.
// 
// The function first constructs the file path by joining the current working directory, 'public' directory, and the 'banners' directory with the specified file name.
// 
// It then uses the 'fs.readFile' function to read the content of the file asynchronously. If an error occurs during reading the file, the code checks if the error code is 'ENOENT', which indicates that the file does not exist. In this case, it reads a default placeholder image file and sends its content as the response.
// 
// If any other error occurs during reading the file, or if no error occurs, it sends the content of the retrieved file as the response.
// 
// If any error occurs during this process, an error response with the appropriate status code is sent.
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;

  try {
    const filePath = path.join(process.cwd(), 'public', 'banners', file);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if(err.code === 'ENOENT') {
          // If the file is not found, send the default image
          fs.readFile(path.join(process.cwd(), 'public', 'placeholderBanner.png'), (err, data) => {
            if (err) {
              res.status(500).json({ error: 'Failed to read file' });
            }
            res.status(200).send(data);
          });
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
