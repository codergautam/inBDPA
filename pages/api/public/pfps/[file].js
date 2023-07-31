// pages/api/public/pfps/[file].js
// This code is written to handle the API request for retrieving profile pictures (pfps) from the server. 
// 
// 1. The code imports the required modules fs and path.
// 2. The handler function is exported as the default function for the API request.
// 3. The function takes in the request and response objects as parameters.
// 4. The function extracts the 'file' parameter from the request query.
// 5. It tries to read the file path by joining the current working directory, 'public', and 'pfps' directory with the 'file' query parameter to get the complete file path.
// 6. If there is an error in reading the file, it checks if the error code is 'ENOENT' (indicating that the file is not found).
// 7. If the file is not found, it sends the default image as the response by reading the placeholderPfp.jpg file.
// 8. If there is an error in reading the default image file, it sends a 500 error response with the corresponding error message.
// 9. If there is any other error in reading the file, it sends a 500 error response with the corresponding error message.
// 10. If there are no errors in reading the file, it sends the file data as the response.
// 11. If there is an error in the try block, it sends a 500 error response with the corresponding error message.
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;

  try {
    const filePath = path.join(process.cwd(), 'public', 'pfps', file);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if(err.code === 'ENOENT') {
          // res.status(404).json({ error: 'File not found' });

          // If the file is not found, send the default image
          fs.readFile(path.join(process.cwd(), 'public', 'placeholderPfp.jpg'), (err, data) => {
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
