const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const router = express.Router();

// Configure Cloudinary (free tier: 25GB storage, 25GB bandwidth)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

// Use memory storage instead of disk (files stay in memory temporarily)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  };

  const fileExt = path.extname(file.originalname).toLowerCase();
  const isValidType = Object.keys(allowedTypes).includes(file.mimetype) &&
                     allowedTypes[file.mimetype].includes(fileExt);

  if (isValidType) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${Object.values(allowedTypes).flat().join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  },
  fileFilter
});

// Upload single file (admin only)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Determine resource type - PDFs need 'raw' type
    const isPDF = req.file.mimetype === 'application/pdf';
    const resourceType = isPDF ? 'raw' : 'auto';

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          resource_type: resourceType,
          public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
          format: isPDF ? 'pdf' : undefined,
          access_mode: 'public', // Make PDFs publicly accessible
          type: 'upload'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // For PDFs, create a download URL with attachment flag
    let downloadUrl = uploadResult.secure_url;
    if (isPDF) {
      // Replace /upload/ with /upload/fl_attachment/ to force download
      downloadUrl = uploadResult.secure_url.replace('/upload/', '/upload/fl_attachment/');
    }

    res.status(201).json({
      url: downloadUrl,
      filename: uploadResult.public_id,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      cloudinary_id: uploadResult.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Upload multiple files (admin only)
router.post('/multiple', upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const protocol = req.protocol;
    const host = req.get('host');

    const uploadedFiles = req.files.map(file => ({
      url: `${protocol}://${host}/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(201).json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get list of uploaded files (admin only)
router.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir)
      .filter(file => {
        const filePath = path.join(uploadDir, file);
        return fs.statSync(filePath).isFile();
      })
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by creation date, newest first

    res.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Delete file (admin only)
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(filepath);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Get file info (admin only)
router.get('/info/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const stats = fs.statSync(filepath);
    const protocol = req.protocol;
    const host = req.get('host');

    res.json({
      filename,
      url: `${protocol}://${host}/uploads/${filename}`,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

module.exports = router;
