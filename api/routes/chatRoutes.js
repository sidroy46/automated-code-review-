import express from 'express';
import { handleCodeChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', handleCodeChat);

export default router;
