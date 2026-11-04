import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No image file uploaded.' }
    });
  }

  const baseUrl = process.env.MEDIA_BASE_URL || `${req.protocol}://${req.get('host')}/uploads`;
  const fileUrl = `${baseUrl}/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: {
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

export default router;
