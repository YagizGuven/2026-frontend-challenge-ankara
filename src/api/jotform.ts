import axios from 'axios';

const API_KEY = import.meta.env.VITE_JOTFORM_API_KEY;

export const jotformApi = axios.create({
  baseURL: 'https://api.jotform.com',
  params: { apiKey: API_KEY }
});

export const fetchFormSubmissions = async (formId: string) => {
  const response = await jotformApi.get(`/form/${formId}/submissions`);
  return response.data.content;
};
