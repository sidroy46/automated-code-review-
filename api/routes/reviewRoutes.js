import express from 'express';
import { handleCodeReview } from '../controllers/reviewController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('codeFile'), handleCodeReview);

export default router;
