import cloudinary from "cloudinary";
import streamifier from "streamifier";

/**
 * Uploads a file buffer to Cloudinary.
 *
 * @param {Buffer} buffer - The file buffer to upload.
 * @param {string} folder - The folder in Cloudinary where the file should be uploaded.
 * @returns {Promise<Object>} - A promise that resolves with the Cloudinary upload result.
 */
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder }, // Correctly specify the folder in Cloudinary
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error.message);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

export default uploadToCloudinary;
