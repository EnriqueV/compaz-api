const ImageKit = require('imagekit');

class ImageKitService {
  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
  }

  async getAllImages(skip = 0, limit = 100) {
    try {
      const images = await this.imagekit.listFiles({
        skip,
        limit
      });

      return images.map(image => ({
        id: image.fileId,
        name: image.name,
        url: image.url,
        thumbnail: image.thumbnail,
        filePath: image.filePath,
        size: image.size,
        createdAt: image.createdAt
      }));
    } catch (error) {
      console.error('Error in getAllImages:', error);
      throw error;
    }
  }

  async getImagesByFolder(folderPath, skip = 0, limit = 100) {
    try {
      const images = await this.imagekit.listFiles({
        path: folderPath,
        skip,
        limit
      });

      return images.map(image => ({
        id: image.fileId,
        name: image.name,
        url: image.url,
        thumbnail: image.thumbnail,
        filePath: image.filePath,
        size: image.size,
        createdAt: image.createdAt
      }));
    } catch (error) {
      console.error('Error in getImagesByFolder:', error);
      throw error;
    }
  }

  async uploadImage(file, fileName, folderPath = '/') {
    try {
      const uploadResponse = await this.imagekit.upload({
        file,
        fileName,
        folder: folderPath
      });

      return {
        id: uploadResponse.fileId,
        name: uploadResponse.name,
        url: uploadResponse.url,
        thumbnail: uploadResponse.thumbnail,
        filePath: uploadResponse.filePath
      };
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }

  async deleteImage(fileId) {
    try {
      await this.imagekit.deleteFile(fileId);
      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      console.error('Error in deleteImage:', error);
      throw error;
    }
  }
}

module.exports = new ImageKitService();