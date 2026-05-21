import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
