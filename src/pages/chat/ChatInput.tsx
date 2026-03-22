import React, { useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSend: (text: string, file: File | null) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [text, setText] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPEG, PNG, WEBP).');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!text.trim() && !selectedFile) || isLoading) return;
    
    onSend(text, selectedFile);
    
    // Reset state
    setText('');
    removeFile();
    if (textareaRef.current) textareaRef.current.style.height = 'auto'; // Reset height
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      {/* Image Preview Overlay */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-3 ml-4 relative inline-block border border-[var(--color-neon-red)]/40 rounded-lg p-1 glass-panel"
          >
            <button 
              onClick={removeFile}
              className="absolute -top-3 -right-3 bg-[var(--color-neon-red)] text-white p-1 rounded-full hover:bg-red-500 shadow-[0_0_10px_rgba(255,51,102,0.6)]"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto glass-panel rounded-2xl p-2 flex items-end gap-2 border border-[var(--color-dojo-border)] shadow-[0_0_20px_rgba(0,0,0,0.4)] focus-within:border-[var(--color-neon-red)]/50 focus-within:shadow-[0_0_20px_rgba(255,51,102,0.15)] transition-all"
      >
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-3 text-gray-400 hover:text-[var(--color-neon-gold)] transition-colors rounded-xl hover:bg-white/5 disabled:opacity-50"
          title="Attach Sparring Image"
        >
          <Paperclip className="w-6 h-6" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />

        {/* Dynamic Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the Dojo Master..."
          disabled={isLoading}
          rows={1}
          className="flex-1 bg-transparent text-white py-3 outline-none focus:ring-0 placeholder-gray-500 resize-none max-h-32 mb-0.5"
          style={{ minHeight: '48px' }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedFile) || isLoading}
          className="p-3 bg-[var(--color-neon-red)] text-white rounded-xl shadow-[0_0_15px_rgba(255,51,102,0.4)] hover:shadow-[0_0_25px_rgba(255,51,102,0.6)] hover:bg-red-500 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <SendHorizontal className="w-6 h-6" />
          )}
        </button>
      </form>
      
      <div className="text-center mt-3 text-[10px] text-gray-500 font-medium tracking-wide">
        AI ASSISTANT CAN MAKE MISTAKES. VERIFY CRITICAL COMBAT ADVICE.
      </div>
    </div>
  );
};
