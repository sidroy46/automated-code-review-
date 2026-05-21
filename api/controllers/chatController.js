import { getChatResponse } from '../services/groqService.js';

export const handleCodeChat = async (req, res) => {
  try {
    const { code, question, history } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const responseText = await getChatResponse(code, question, history || []);

    return res.status(200).json({
      success: true,
      response: responseText
    });
  } catch (err) {
    console.error('Chat Controller Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'System failed to fetch chat answer.'
    });
  }
};
