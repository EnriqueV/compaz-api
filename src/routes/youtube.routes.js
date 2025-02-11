const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtube.service');

// Get channel info
router.get('/channel/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const channelInfo = await youtubeService.getChannelInfo(username);
    res.json(channelInfo);
  } catch (error) {
    console.error('Error in channel route:', error);
    res.status(error.message === 'Channel not found' ? 404 : 500)
      .json({ error: error.message || 'Failed to fetch channel info' });
  }
});

// Get channel videos
router.get('/videos/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { pageToken, maxResults } = req.query;
    const videos = await youtubeService.getChannelVideos(channelId, pageToken, maxResults);
    res.json(videos);
  } catch (error) {
    console.error('Error in videos route:', error);
    res.status(error.message === 'Channel not found' ? 404 : 500)
      .json({ error: error.message || 'Failed to fetch videos' });
  }
});

// Search videos in channel
router.get('/search/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { query, pageToken, maxResults } = req.query;
    const searchResults = await youtubeService.searchChannelVideos(
      channelId,
      query,
      pageToken,
      maxResults
    );
    res.json(searchResults);
  } catch (error) {
    console.error('Error in search route:', error);
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

module.exports = router;