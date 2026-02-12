
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, User, Bot, Loader2, ArrowLeft, Tag, Layers, Palette, Image as ImageIcon, X } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for display
  isStreaming?: boolean;
}

interface AIStylistProps {
  product?: Product | null;
  onBack?: () => void;
}

export const AIStylist: React.FC<AIStylistProps> = ({ product, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef<Chat | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Get plain Base64 string for display
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Initialize Chat with Inventory Context
  useEffect(() => {
    const initChat = async () => {
      try {
        // Create a condensed inventory string for the AI context
        const inventoryContext = PRODUCTS.map(p => 
          `- ${p.name} ($${p.price}): ${p.category}, ${p.colors.join('/')}, ${p.description}`
        ).join('\n');

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are a high-end fashion stylist for LUMIÈRE. 
            
            Your Capabilities:
            1. Analyze images uploaded by users (dresses, outfits, accessories).
            2. Match user images or descriptions to our collection.
            3. Provide styling advice, color pairings, and occasion tips.
            
            Our Collection (Use this to make recommendations):
            ${inventoryContext}
            
            Tone: Elegant, sophisticated, helpful, and concise. 
            If the user uploads an image, analyze its style/color and suggest matching items from our collection or general styling advice.`,
          },
        });
        chatSession.current = chat;

        // Initial greeting
        if (product) {
          const contextPrompt = `The user is looking at: ${product.name} (${product.category}, $${product.price}). Color options: ${product.colors.join(', ')}. Description: ${product.description}. Start by offering advice for this specific item.`;
          
          setIsLoading(true);
          // Use 'message' property with string content
          const response = await chat.sendMessage({ 
             message: contextPrompt 
          });
          
          setMessages([
            {
              id: 'init-1',
              role: 'model',
              text: response.text || `Excellent choice. The ${product.name} is a versatile piece. How would you like to style it today?`
            }
          ]);
          setIsLoading(false);
        } else {
          setMessages([
            {
              id: 'init-0',
              role: 'model',
              text: "Welcome to LUMIÈRE Personal Styling. Upload an outfit inspiration or ask me for advice. How may I assist you?"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to init chat", error);
        setMessages([
          {
            id: 'error-init',
            role: 'model',
            text: "I apologize, but I am currently unable to connect to the styling service. Please try again later."
          }
        ]);
      }
    };

    initChat();
  }, [product]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      try {
        const base64Display = await fileToBase64(file);
        setSelectedImage(base64Display);
        setSelectedMimeType(file.type);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedMimeType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || !chatSession.current || isLoading) return;

    const currentInput = input;
    const currentImage = selectedImage;
    const currentMime = selectedMimeType;

    // Reset UI input state immediately
    setInput('');
    clearImage();
    setIsLoading(true);

    // Add User Message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      image: currentImage || undefined
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let messageParts: any[] = [];
      
      // Construct parts for Gemini
      if (currentImage && currentMime) {
        // Strip the data:image/... base64 prefix for the API call
        const base64Data = currentImage.split(',')[1];
        messageParts.push({
          inlineData: {
            mimeType: currentMime,
            data: base64Data
          }
        });
      }

      if (currentInput) {
        messageParts.push({ text: currentInput });
      } else if (currentImage) {
        // If image only, add a prompt to analyze it
        messageParts.push({ text: "Please analyze this image. If it's a clothing item, suggest matching products from your collection or how to style it. If it's a vibe/aesthetic, suggest an outfit." });
      }

      // Use 'message' property containing the parts array for multimodal input
      const result = await chatSession.current.sendMessageStream({ 
        message: { parts: messageParts }
      });
      
      const modelMessageId = (Date.now() + 1).toString();
      let fullText = '';
      
      // Add placeholder for streaming message
      setMessages(prev => [
        ...prev,
        { id: modelMessageId, role: 'model', text: '', isStreaming: true }
      ]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMessageId 
                ? { ...msg, text: fullText } 
                : msg
            )
          );
        }
      }
      
      // Finalize message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === modelMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: "I apologize, I encountered a momentary issue processing your request." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="md:hidden p-2 -ml-2 text-stone-500 hover:text-stone-900">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-serif text-stone-900 flex items-center gap-3">
              <Sparkles size={28} className="text-stone-400" />
              LUMIÈRE Stylist
            </h1>
            <p className="text-sm text-stone-500 mt-1">Upload inspiration or ask for advice</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch h-full flex-1">
        
        {/* Product Details Section - Visible if a product is selected */}
        {product && (
          <div className="lg:w-1/3 w-full animate-in slide-in-from-left duration-500 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden sticky top-28">
              <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100 relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-sm text-xs font-bold tracking-wider uppercase">
                  Currently Styling
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-serif text-stone-900">{product.name}</h2>
                    <span className="text-xl font-medium text-stone-900">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-stone-500 mt-1">{product.category}</p>
                </div>
                {/* Condensed info for side view */}
                <div className="flex flex-wrap gap-2">
                   {product.colors.map(c => <span key={c} className="text-xs bg-stone-100 px-2 py-1 rounded-full text-stone-600">{c}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className={`flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden ${!product ? 'max-w-4xl mx-auto w-full h-[700px]' : 'h-[750px] lg:h-auto'}`}>
          {/* Mobile Product Banner */}
          {product && (
            <div className="lg:hidden bg-stone-50 px-4 py-3 flex items-center gap-3 border-b border-stone-100">
               <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-xs text-stone-500">Styling</p>
                 <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
               </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-1 overflow-hidden shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-white text-stone-800 border border-stone-100'
                  }`}
                >
                  {msg.image && (
                    <div className="mb-2 rounded-xl overflow-hidden">
                      <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-64 object-cover" />
                    </div>
                  )}
                  {msg.text && (
                    <div className={`px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap`}>
                      {msg.text}
                      {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-stone-400 animate-pulse"/>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stone-100">
            {/* Image Preview */}
            {selectedImage && (
              <div className="flex items-center gap-2 mb-3 bg-stone-50 w-fit p-2 rounded-lg border border-stone-200 animate-in slide-in-from-bottom-2">
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={clearImage}
                  className="p-1 hover:bg-stone-200 rounded-full text-stone-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="relative flex items-end gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors mb-0.5"
                title="Upload image"
              >
                <ImageIcon size={20} />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={product ? `Ask about styling...` : "Upload an image or describe what you're looking for..."}
                className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-1 focus:ring-stone-900 focus:border-stone-900 resize-none min-h-[50px] max-h-[120px] no-scrollbar transition-all"
                rows={1}
              />
              
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-stone-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
            <p className="text-center text-[10px] text-stone-400 mt-2">
              Lumière Assistant can analyze images and suggest styles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
