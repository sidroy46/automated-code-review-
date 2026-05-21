import axios from 'axios';

// Under a Vercel deployment, the backend and frontend run on the same origin.
// During development, Vite proxy routes '/api' requests to 'http://localhost:5000/api'.
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

export const reviewCode = async (file, codeText, language, mode, explanationLanguage) => {
  const formData = new FormData();
  if (file) {
    formData.append('codeFile', file);
  }
  formData.append('code', codeText || '');
  formData.append('language', language);
  formData.append('mode', mode);
  formData.append('explanationLanguage', explanationLanguage);

  const response = await api.post('/review', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const chatWithAI = async (code, question, history) => {
  const response = await api.post('/chat', {
    code,
    question,
    history,
  });
  return response.data;
};

export default api;
