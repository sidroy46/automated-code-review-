import { getChatResponse } from '../services/groqService.js';

export async function handleCodeChat(req, res) {
  try {
    const { code, question, history } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const aiResponse = await getChatResponse(code || '', question, history || []);

    res.status(200).json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while communicating with the AI assistant.'
    });
  }
}
