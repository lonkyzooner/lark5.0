import React, { useState, useRef, useEffect, useCallback, useContext, useMemo } from 'react';
import '../styles/chat-fix.css';
import VoiceContext from '../contexts/VoiceContext';
import LiveKitVoiceContext from '../contexts/LiveKitVoiceContext';
import { useWebSpeech } from '../hooks/useWebSpeech';
import { useSettings } from '../lib/settings-store';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { SendIcon, VolumeIcon, StopCircleIcon, Mic, MicOff, AlertCircle, Info, MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Memoized message component to prevent unnecessary re-renders
const MessageBubble = React.memo(({ message, onSpeakText }: { message: Message, onSpeakText: (text: string) => void }) => {
  // Format the timestamp
  const formattedTime = useMemo(() => {
    const date = new Date(message.timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, [message.timestamp]);

  return (
    <div className={`message ${message.role} mb-4`}>
      <div className="flex items-start gap-3">
        {message.role === 'assistant' && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002166] to-[#0046c7] flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white/50 transform transition-all duration-300 hover:scale-105">
            L
          </div>
        )}
        <div
          className={`message-bubble p-4 rounded-xl shadow-md max-w-[85%] ${
            message.role === 'assistant'
            ? 'bg-gradient-to-br from-[#002166] to-[#0046c7] text-white rounded-tr-none border border-blue-400/20 hover:shadow-blue-200/20 hover:shadow-xl transition-all duration-300'
            : 'bg-white/95 text-gray-800 rounded-tl-none border border-gray-200/50 backdrop-blur-lg hover:shadow-xl transition-all duration-300'
          }`}
        >
          <div className="whitespace-pre-wrap text-[15px]">{message.content}</div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs opacity-70">{formattedTime}</span>

            {message.role === 'assistant' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onSpeakText(message.content)}
                      className="text-xs flex items-center bg-white/80 hover:bg-white px-2 py-1 rounded-full shadow-sm transition-colors border border-gray-200/50"
                    >
                      <VolumeIcon className="h-3 w-3 mr-1 text-[#003087]" />
                      <span className="text-gray-700">Listen</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Read this message aloud</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {message.role === 'user' && (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold shadow-md ring-2 ring-white/50">
            U
          </div>
        )}
      </div>
    </div>
  );
});

// Set display name for memo component
MessageBubble.displayName = 'MessageBubble';

export const LarkChatFixed: React.FC = () => {
  const voice = useContext(VoiceContext);
  const liveKitVoice = useContext(LiveKitVoiceContext);
  const webSpeech = useWebSpeech();
  const { getOfficerName, getOfficerRank, getOfficerCodename } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Initialize chat
  useEffect(() => {
    // Check if we're in offline mode
    const apiKeyMissing = !import.meta.env.VITE_OPENAI_API_KEY;
    setOfflineMode(apiKeyMissing || !navigator.onLine);

    // Add welcome message
    const welcomeMessage = {
      role: 'assistant' as const,
      content: offlineMode
        ? "Welcome to LARK Assistant. I'm currently operating in offline mode with limited functionality. I can still help with basic tasks and information."
        : "Welcome to LARK Assistant. How can I help you today?",
      timestamp: Date.now()
    };

    setMessages([welcomeMessage]);
    setIsInitialized(true);

    // Set up network status monitoring
    const handleNetworkChange = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        setOfflineMode(true);
        setInfo("You're offline. Limited functionality available.");
      } else if (apiKeyMissing) {
        setOfflineMode(true);
        setInfo("API key missing. Operating in offline mode.");
      } else {
        setInfo("You're back online.");
        setTimeout(() => setInfo(null), 3000);
      }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Check for Miranda command but don't trigger it directly from here
      // Instead, provide information about how to access Miranda Rights
      if (input.toLowerCase().includes('miranda')) {
        const assistantResponse = {
          role: 'assistant' as const,
          content: "To access Miranda Rights, please use the dedicated Miranda tab for the most reliable experience. You can click on the 'Go to Miranda Tab' button below or select it from the navigation menu.",
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, assistantResponse]);

        // Show info message with direct link
        setInfo("For Miranda Rights, use the dedicated Miranda tab for best results.");
        setTimeout(() => setInfo(null), 5000);
      } else if (offlineMode) {
        // Handle offline mode with predefined responses
        setTimeout(() => {
          const offlineResponse = {
            role: 'assistant' as const,
            content: "I'm currently in offline mode with limited functionality. For full capabilities, please ensure you have an internet connection and a valid API key configured.",
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, offlineResponse]);
          setIsProcessing(false);
        }, 1000);
      } else {
        // Normal processing for other commands
        // In a real implementation, this would call your API
        setTimeout(() => {
          const assistantResponse = {
            role: 'assistant' as const,
            content: `I received your message: "${input}". This is a placeholder response as the API is not fully connected.`,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, assistantResponse]);
          setIsProcessing(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Error processing message:', err);
      setError('Failed to process your message. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle speaking text
  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      // Stop speaking using the appropriate API
      if (webSpeech.isSupported) {
        webSpeech.stopSpeaking();
      } else {
        liveKitVoice.stopSpeaking();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    // Use Web Speech API if supported, otherwise fall back to LiveKit
    if (webSpeech.isSupported) {
      webSpeech.speak(text, 'male', () => {
        setIsSpeaking(false);
      });
    } else {
      liveKitVoice.speak(text, () => {
        setIsSpeaking(false);
      });
    }
  };

  // Render the chat interface
  return (
    <div className="chat-container">
      {/* Error message */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="error-message mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Info message */}
      {info && (
        <div
          role="status"
          aria-live="polite"
          className="info-message mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 flex items-center gap-2"
        >
          <Info className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span>{info}</span>
        </div>
      )}

      {/* Chat messages */}
      <ScrollArea className="chat-messages p-5 rounded-xl border border-white/50 bg-white/95 shadow-lg backdrop-blur-lg transition-all duration-300 hover:shadow-xl">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} onSpeakText={handleSpeakText} />
          ))}
          <div ref={messagesEndRef} className="message-end-anchor" />
        </div>
      </ScrollArea>

      {/* Loading indicator */}
      {isProcessing && (
        <div className="flex justify-center my-4" role="status" aria-live="polite">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002166] border-t-2 border-t-[#0046c7]/30 shadow-md"
            aria-hidden="true"
          ></div>
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <Input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isProcessing}
              aria-disabled={isProcessing}
              className="flex-1 text-black border-white/50 focus:border-[#002166] focus:ring-[#002166] rounded-full py-6 pl-12 pr-5 shadow-md bg-white/95 backdrop-blur-lg transition-all duration-300 hover:shadow-lg"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Badge variant="outline" className="bg-blue-50 text-[#002166] border-blue-200">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
              </Badge>
            </div>
          </div>

          {/* Send button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  disabled={isProcessing || !input.trim()}
                  aria-label="Send message"
                  className="bg-gradient-to-r from-[#002166] to-[#0046c7] text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <SendIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Stop speaking button */}
          {isSpeaking && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => handleSpeakText('')}
                    aria-label="Stop speaking"
                    className="bg-red-500 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <StopCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stop speaking</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Text-to-speech button */}
          {!isSpeaking && messages.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => {
                      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
                      if (lastAssistantMessage) {
                        handleSpeakText(lastAssistantMessage.content);
                      }
                    }}
                    aria-label="Speak last message"
                    className="border-white/50 hover:bg-white/80 transition-all duration-300 rounded-full shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <VolumeIcon className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Speak last message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Microphone button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gradient-to-r from-[#002166]/10 to-[#0046c7]/10 border-[#002166]/20 hover:bg-gradient-to-r hover:from-[#002166]/20 hover:to-[#0046c7]/20 transition-all duration-300 rounded-full shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={async () => {
                    if (voice.isListening) {
                      voice.stopListening();
                    } else {
                      // Request microphone permission if needed
                      if (voice.micPermission === 'denied' || voice.micPermission === 'prompt') {
                        const granted = await voice.requestMicrophonePermission();
                        if (!granted) {
                          setError('Microphone access is required for voice commands. Using text input instead.');
                          setInfo('You can still use LARK by typing your messages in the text box below.');
                          setTimeout(() => {
                            setError(null);
                            setTimeout(() => setInfo(null), 3000);
                          }, 3000);
                          return;
                        }
                      }
                      voice.startListening();
                    }
                  }}
                  disabled={!isOnline}
                  aria-label={voice.isListening ? "Stop voice input" : voice.micPermission === 'denied' ? "Microphone access denied" : "Start voice input"}
                  aria-pressed={voice.isListening}
                >
                  {voice.isListening ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/30 rounded-full animate-ping opacity-75" aria-hidden="true"></div>
                      <div className="absolute inset-0 bg-green-300/30 rounded-full animate-pulse opacity-50" aria-hidden="true"></div>
                      <Mic className="h-5 w-5 text-green-600 relative z-10" aria-hidden="true" />
                    </div>
                  ) : voice.micPermission === 'denied' ? (
                    <div className="relative">
                      <MicOff className="h-5 w-5 text-red-500 relative z-10" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mic className="h-5 w-5 text-[#002166] relative z-10" aria-hidden="true" />
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{voice.isListening ? "Stop listening" : voice.micPermission === 'denied' ? "Microphone access denied" : "Start voice input"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </form>

      {/* Go to Miranda Tab button when needed */}
      {messages.some(msg => msg.content.toLowerCase().includes('miranda')) && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => {
              try {
                const mirandaTabTrigger = document.querySelector('[value="miranda"]') as HTMLElement;
                if (mirandaTabTrigger) {
                  mirandaTabTrigger.click();
                } else {
                  // Fallback using custom event
                  document.dispatchEvent(new CustomEvent('changeTab', {
                    detail: { tabId: 'miranda' }
                  }));
                }
              } catch (error) {
                console.error('Error navigating to Miranda tab:', error);
              }
            }}
            className="bg-gradient-to-r from-[#002166] to-[#0046c7] text-white"
            aria-label="Navigate to Miranda Rights tab"
          >
            Go to Miranda Tab
          </Button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center text-sm text-gray-500 mt-2" aria-live="polite">
          <div className="inline-block animate-pulse">Processing your request...</div>
        </div>
      )}
    </div>
  );
};

export default LarkChatFixed;
