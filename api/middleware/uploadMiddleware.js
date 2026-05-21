import multer from 'multer';
import path from 'path';

// Using memory storage is 100% compatible with Vercel Serverless Functions.
// It avoids local write permission errors by keeping uploads in memory buffers.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.txt', '.json', '.html', '.css'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
