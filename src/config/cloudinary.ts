import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: 'dfs540rt8',
  api_key: '393498944556749',
  api_secret: '-mnTD9Y96yxJLY_SESRwp34Gb38', // JWT Secret
});

export default cloudinary;