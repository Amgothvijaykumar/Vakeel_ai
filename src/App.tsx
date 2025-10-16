import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import IconBar from './components/IconBar';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import Settings from './pages/Settings';
import { ToastContainer } from './components/Toast';
import type { Toast } from './components/Toast';

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Contract Analysis Case #142',
    date: '10/13/2025, 1:10 AM',
    messages: [
      { sender: 'ai', text: 'Hello! As your AI Legal Assistant, how can I help you today?' },
    ],
  },
  {
    id: 'conv-2',
    title: 'Initial Consultation',
    date: '10/12/2025, 4:30 PM',
    messages: [
      { sender: 'ai', text: 'Welcome to your initial consultation.' },
    ],
  },
];

export const Theme = {
  Light: "light",
  Dark: "dark",
  Auto: "auto",
} as const;
export type Theme = typeof Theme[keyof typeof Theme];

export interface AppConfig {
  theme: Theme;
  model: string;
}

const initialConfig: AppConfig = {
  theme: Theme.Dark,
  model: "Llama-3-8B-Instruct-q4f32_1-MLC",
};

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    
    if (config.theme === Theme.Auto) {
      // Use system preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDarkMode);
    } else if (config.theme === Theme.Dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config.theme]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateConfig = (updater: (config: AppConfig) => void) => {
    const newConfig = { ...config };
    updater(newConfig);
    setConfig(newConfig);
  };

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `New Conversation ${conversations.length + 1}`,
      date: new Date().toLocaleString(),
      messages: [
        { sender: 'ai', text: 'Hello! As your AI Legal Assistant, how can I help you today?' },
      ],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setIsSidebarOpen(false);
    showToast('New conversation created', 'success');
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev =>
      prev.map(conv => (conv.id === id ? { ...conv, title: newTitle } : conv))
    );
    showToast('Conversation renamed successfully', 'success');
  };

  const handleNewMessage = (newMessage: Message) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );
  };

  const handleClearChat = () => {
    if (!window.confirm("Are you sure you want to clear all messages in this chat?")) return;
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [conv.messages[0]] } // Keep the initial AI message
          : conv
      )
    );
  };

  const handleDeleteLastMessage = () => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === activeConversationId && conv.messages.length > 1) {
          const lastMessage = conv.messages[conv.messages.length - 1];
          const messagesToRemove = lastMessage.sender === 'ai' ? 2 : 1;
          return { ...conv, messages: conv.messages.slice(0, -messagesToRemove) };
        }
        return conv;
      })
    );
  };

  return (
    <Router>
  <div className="flex h-full w-full bg-bg-main font-sans text-text-primary overflow-hidden">
        <IconBar onNewChat={handleNewConversation} />
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
  <Routes>
          <Route path="/" element={
            activeConversation && (
              <ChatPanel
                key={activeConversation.id}
                conversation={activeConversation}
                onNewMessage={handleNewMessage}
                onClearChat={handleClearChat}
                onDeleteLastMessage={handleDeleteLastMessage}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                onRenameConversation={handleRenameConversation}
                showToast={showToast}
              />
            )
          } />
          <Route path="/settings" element={
            <Settings config={config} updateConfig={updateConfig} />
          } />
        </Routes>
        <ToastContainer toasts={toasts} onClose={closeToast} />
      </div>
    </Router>
  );
}

export default App;

