const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const os = require('os');

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolioos',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image/:publicId
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = { upload, uploadImage, deleteImage };
