import { useState, useRef, useEffect } from 'react';
import { ChatMessage, type MessageProps } from './ChatMessage';
import { ChatInput } from './ChatInput';
import api from '../../lib/axios';

export const ChatController = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chat/history');
        // Maps backend chat history DTO to frontend MessageProps format
        const history: MessageProps[] = [];
        // Assuming the backend returns Page<ChatMessage>, content is an array
        const rawLogs = res.data.content || res.data; 
        
        rawLogs.forEach((msg: any) => {
          // Add User query
          history.push({
            id: `usr-${msg.id}`,
            role: 'user',
            content: msg.query,
            timestamp: msg.createdAt,
            imageUrl: msg.imageUrl
          });
          // Add AI answer
          history.push({
            id: `ai-${msg.id}`,
            role: 'assistant',
            content: msg.answer,
            timestamp: msg.createdAt,
            confidence: msg.confidence
          });
        });
        
        // Ensure chronological order
        history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessages(history);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };
    
    fetchHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async (text: string, file: File | null) => {
    if (!text.trim() && !file) return;

    // 1. Optimistically append user message to UI
    const tempId = Date.now().toString();
    const newUserMsg: MessageProps = {
      id: `usr-temp-${tempId}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      imageUrl: file ? URL.createObjectURL(file) : undefined
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // 2. Prepare Form Data for multipart upload
      const formData = new FormData();
      formData.append('query', text);
      if (file) {
        formData.append('image', file);
      }

      // 3. Send to Java Backend
      const res = await api.post('/chat/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 4. Append actual AI response to UI
      const aiResponseMsg: MessageProps = {
        id: `ai-${res.data.id || tempId}`,
        role: 'assistant',
        content: res.data.answer,
        timestamp: new Date().toISOString(),
        confidence: res.data.confidence
      };

      setMessages((prev) => [...prev, aiResponseMsg]);

    } catch (err: any) {
      console.error("Chat send failed", err);
      
      // Fallback Error Message
      const errorMsg: MessageProps = {
        id: `err-${tempId}`,
        role: 'assistant',
        content: `**Error:** The Dojo Master is currently unavailable. \n\n_${err.response?.data?.message || err.message}_`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 relative">
      {/* Scrollable Message History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6" ref={scrollRef}>
        
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <div className="w-24 h-24 mb-6 rounded-full glass-panel flex items-center justify-center shadow-[0_0_30px_rgba(255,51,102,0.15)] text-[var(--color-neon-red)]">
              <span className="text-4xl">🥋</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase pb-2">Master Your Mind</h2>
            <p className="max-w-md mt-4 text-gray-400">
              Ask about techniques, upload a sparring clip for frame analysis, or query live sports events.
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 pb-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}

      </div>

      {/* Input Area anchored to bottom */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-[var(--color-dojo-dark)] via-[var(--color-dojo-dark)]/90 to-transparent sticky bottom-0">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};
