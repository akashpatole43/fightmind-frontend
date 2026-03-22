
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, User as UserIcon } from 'lucide-react';

export interface MessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  confidence?: number;
}

export const ChatMessage = ({ message }: { message: MessageProps }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`flex w-full gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border
        ${isUser 
          ? 'bg-[var(--color-dojo-secondary)] border-[var(--color-neon-gold)]/30 text-[var(--color-neon-gold)]' 
          : 'bg-black border-[var(--color-neon-red)]/50 text-[var(--color-neon-red)]'
        }`}
      >
        {isUser ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-5 py-3.5 rounded-2xl shadow-md backdrop-blur-sm
          ${isUser 
            ? 'glass-button rounded-tr-sm text-white border-b-2 border-r-2 border-[var(--color-dojo-border)]' 
            : 'glass-panel rounded-tl-sm text-gray-200 border-l-2 border-[var(--color-neon-red)]/30'
          }`}
        >
          {/* External Image Attachment (if applicable) */}
          {message.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-lg border border-[var(--color-dojo-border)]">
              <img 
                src={message.imageUrl} 
                alt="Uploaded reference" 
                className="max-w-full h-auto object-cover max-h-64"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Markdown Content */}
          <div className={`prose prose-invert prose-p:leading-relaxed max-w-none
            ${isUser ? 'prose-p:text-white' : 'prose-p:text-gray-200'}
            prose-headings:text-[var(--color-neon-gold)]
            prose-a:text-[var(--color-neon-red)] prose-a:no-underline hover:prose-a:underline
            prose-code:text-[var(--color-neon-red)] prose-code:bg-black/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          `}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer (Time & Admin Confidence Metrics) */}
        <div className="flex items-center gap-3 mt-1.5 px-1 opacity-60 text-xs font-semibold tracking-wider text-gray-400">
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          
          {!isUser && message.confidence && (
            <>
              <span>•</span>
              <span className={message.confidence > 0.8 ? "text-green-400" : "text-yellow-400"}>
                AI CONF: {(message.confidence * 100).toFixed(1)}%
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
