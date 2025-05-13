import { useState } from 'react';
import axios from 'axios';
import { Message } from '../types';

const useChatService = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = { 
      role: 'user', 
      text: input,
      timestamp: Date.now()
    };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Send request to API
      const response = await axios.post('http://localhost:5000/chat', {
        message: input,
      });
      
      // Add assistant response to chat
      const assistantMessage: Message = { 
        role: 'assistant', 
        text: response.data.answer,
        timestamp: Date.now()
      };
      setChat(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = { 
        role: 'assistant', 
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      setChat(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    chat,
    isLoading,
    sendMessage,
  };
};

export default useChatService;