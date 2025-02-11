const express = require('express');
const router = express.Router();
const imageKitService = require('../services/imagekit.service');
const multer = require('multer');
const upload = multer();

// Get all images
router.get('/', async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const images = await imageKitService.getAllImages(parseInt(skip), parseInt(limit));
    res.json(images);
  } catch (error) {
    console.error('Error in get all images route:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get images by folder
router.get('/folder/:folderPath', async (req, res) => {
  try {
    const { folderPath } = req.params;
    const { skip, limit } = req.query;
    const images = await imageKitService.getImagesByFolder(
      folderPath,
      parseInt(skip),
      parseInt(limit)
    );
    res.json(images);
  } catch (error) {
    console.error('Error in get folder images route:', error);
    res.status(500).json({ error: 'Failed to fetch images from folder' });
  }
});

// Upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { filename, folder } = req.body;
    const uploadResult = await imageKitService.uploadImage(
      req.file.buffer,
      filename || req.file.originalname,
      folder
    );
    res.json(uploadResult);
  } catch (error) {
    console.error('Error in upload image route:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const result = await imageKitService.deleteImage(fileId);
    res.json(result);
  } catch (error) {
    console.error('Error in delete image route:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;