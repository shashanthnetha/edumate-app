import React, { useState } from 'react';
import { X, Send, Paperclip, Bot, User } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'ai', text: 'Hello! I am your AI Tutor. Upload a PDF or ask me a question about Python.' }
  ]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // 1. Handle Sending Messages
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add User Message immediately
    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput("");

    // Call Backend
    try {
      const res = await fetch('http://127.0.0.1:8000/ask_tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_question: input, current_topic: "General" })
      });
      const data = await res.json();
      
      // Add AI Response
      setMessages([...newMsgs, { role: 'ai', text: data.reply }]);
    } catch (e) {
      setMessages([...newMsgs, { role: 'ai', text: "Error: Could not connect to Brain." }]);
    }
  };

  // 2. Handle File Uploads
  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch('http://127.0.0.1:8000/upload_pdf', { method: 'POST', body: formData });
      setMessages(prev => [...prev, { role: 'ai', text: `✅ Read ${file.name}. I am ready to answer questions about it!` }]);
    } catch (error) {
      alert("Upload failed");
    }
    setIsUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Bot size={24} />
            <h3 className="font-bold">AI Tutor</h3>
          </div>
          <button onClick={onClose} className="hover:bg-indigo-500 p-1 rounded"><X size={20} /></button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            <label className="p-3 text-gray-400 hover:text-indigo-600 cursor-pointer transition">
              <Paperclip size={20} />
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
            </label>
            <input 
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder={isUploading ? "Reading PDF..." : "Ask a question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatModal;