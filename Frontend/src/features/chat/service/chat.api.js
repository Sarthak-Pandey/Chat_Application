import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/chats',
  withCredentials: true,
});

/**
 * Fetch all chats for the authenticated user
 */
export async function getChats() {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Fetch messages for a specific chat
 * @param {string} chatId
 */
export async function getMessages(chatId) {
  try {
    const response = await api.get(`/${chatId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Send a message (creates a chat if chatId is not provided)
 * @param {string} message
 * @param {string} [chatId]
 */
export async function sendMessage(message, chatId, socketId, tempId) {
  try {
    const response = await api.post('/message', { message, chat: chatId, socketId, tempId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

/**
 * Delete a specific chat
 * @param {string} chatId
 */
export async function deleteChat(chatId) {
  try {
    const response = await api.delete(`/delete/${chatId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
