import fs from 'fs/promises';
import path from 'path';
import { getCodeReview } from '../services/groqService.js';

export async function handleCodeReview(req, res) {
  let tempFilePath = null;
  try {
    let { code, language, mode, explanationLanguage } = req.body;

    // Check if file was uploaded
    if (req.file) {
      tempFilePath = req.file.path;
      // Read file content
      code = await fs.readFile(tempFilePath, 'utf8');
      
      // Auto-detect language from file extension if not explicitly specified
      if (!language || language === 'Auto') {
        const ext = path.extname(req.file.originalname).toLowerCase();
        const extMapping = {
          '.js': 'JavaScript',
          '.jsx': 'JavaScript',
          '.ts': 'TypeScript',
          '.tsx': 'TypeScript',
          '.py': 'Python',
          '.java': 'Java',
          '.c': 'C',
          '.cpp': 'C++',
          '.h': 'C++'
        };
        language = extMapping[ext] || 'JavaScript';
      }
    }

    if (!code || code.trim() === '') {
      return res.status(400).json({ error: 'No code content provided for review.' });
    }

    // Default configuration if missing
    language = language || 'JavaScript';
    mode = mode || 'Professional';
    explanationLanguage = explanationLanguage || 'English';

    // Perform review via Groq service
    const reviewResult = await getCodeReview(code, language, mode, explanationLanguage);

    res.status(200).json({
      success: true,
      data: reviewResult,
      meta: { language, mode, explanationLanguage }
    });

  } catch (error) {
    console.error('Error in review controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An internal error occurred during the review process.'
    });
  } finally {
    // Cleanup temporary upload files if they exist
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', tempFilePath, err);
      }
    }
  }
}
