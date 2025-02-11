const { google } = require('googleapis');

class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
  }

  async getChannelInfo(username) {
    try {
      const response = await this.youtube.channels.list({
        part: 'id,snippet',
        forUsername: username
      });

      if (!response.data.items || response.data.items.length === 0) {
        const searchResponse = await this.youtube.search.list({
          part: 'id,snippet',
          q: username,
          type: 'channel',
          maxResults: 1
        });

        if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
          throw new Error('Channel not found');
        }

        return {
          id: searchResponse.data.items[0].id.channelId,
          title: searchResponse.data.items[0].snippet.title,
          description: searchResponse.data.items[0].snippet.description,
          thumbnail: searchResponse.data.items[0].snippet.thumbnails.high.url
        };
      }

      return {
        id: response.data.items[0].id,
        title: response.data.items[0].snippet.title,
        description: response.data.items[0].snippet.description,
        thumbnail: response.data.items[0].snippet.thumbnails.high.url
      };
    } catch (error) {
      console.error('Error in getChannelInfo:', error);
      throw error;
    }
  }

  async getChannelVideos(channelId, pageToken = '', maxResults = 50) {
    try {
      const channelResponse = await this.youtube.channels.list({
        part: 'contentDetails,snippet',
        id: channelId
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channelInfo = channelResponse.data.items[0];
      const uploadsPlaylistId = channelInfo.contentDetails.relatedPlaylists.uploads;

      const playlistResponse = await this.youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: Math.min(maxResults, 50),
        pageToken: pageToken
      });

      const videos = playlistResponse.data.items.map(item => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        // Añadimos las URLs para ver el video
        watchUrl: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.contentDetails.videoId}`
      }));

      return {
        channelTitle: channelInfo.snippet.title,
        channelThumbnail: channelInfo.snippet.thumbnails.high?.url,
        videos,
        nextPageToken: playlistResponse.data.nextPageToken,
        prevPageToken: playlistResponse.data.prevPageToken,
        totalResults: playlistResponse.data.pageInfo.totalResults
      };
    } catch (error) {
      console.error('Error in getChannelVideos:', error);
      throw error;
    }
}

  async searchChannelVideos(channelId, query, pageToken = '', maxResults = 50) {
    try {
      const searchResponse = await this.youtube.search.list({
        part: 'snippet',
        channelId,
        q: query,
        type: 'video',
        order: 'date',
        maxResults: Math.min(maxResults, 50),
        pageToken: pageToken
      });

      const videos = searchResponse.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt
      }));

      return {
        videos,
        nextPageToken: searchResponse.data.nextPageToken,
        prevPageToken: searchResponse.data.prevPageToken,
        totalResults: searchResponse.data.pageInfo.totalResults
      };
    } catch (error) {
      console.error('Error in searchChannelVideos:', error);
      throw error;
    }
  }
}

module.exports = new YouTubeService();