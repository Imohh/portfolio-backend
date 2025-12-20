import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25MB
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
});