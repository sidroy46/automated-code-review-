import { getCodeReview } from '../services/groqService.js';

export const handleCodeReview = async (req, res) => {
  try {
    const { code, language, mode, explanationLanguage } = req.body;
    let codeToReview = code || '';

    // If file is uploaded, parse from memory buffer instead of disk path
    if (req.file) {
      codeToReview = req.file.buffer.toString('utf8');
    }

    if (!codeToReview || codeToReview.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'No source code was submitted for analysis.'
      });
    }

    const reviewData = await getCodeReview(codeToReview, language, mode, explanationLanguage);
    
    return res.status(200).json({
      success: true,
      data: reviewData
    });

  } catch (err) {
    console.error('Review Controller Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'System failed to review the submitted code snippet.'
    });
  }
};
