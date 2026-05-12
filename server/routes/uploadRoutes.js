const express = require('express');
const router = express.Router();
const { upload, uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/image', protect, adminOnly, upload.single('image'), uploadImage);
router.delete('/image/:publicId', protect, adminOnly, deleteImage);

module.exports = router;
